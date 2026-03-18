#!/usr/bin/env python3
"""
Script migrate toàn bộ dữ liệu từ SQLite local lên Render PostgreSQL
Gọi trực tiếp qua API backend đã deploy
"""
import sqlite3, requests, json

RENDER_URL = "https://giotam.onrender.com"
LOCAL_DB = "instance/blood.db"

conn = sqlite3.connect(LOCAL_DB)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

# Bước 1: Đăng nhập admin để lấy token (nếu cần)
print("=== BẮT ĐẦU MIGRATE ===\n")

# Bước 2: Tạo tất cả users
cur.execute('SELECT * FROM users ORDER BY id')
users = [dict(r) for r in cur.fetchall()]

print(f"Tìm thấy {len(users)} users cần migrate...\n")

render_user_id_map = {}  # SQLite id -> Render id

for u in users:
    print(f"→ Xử lý: [{u['role']}] {u['name']} ({u['email']})")

    # Kiểm tra xem user đã tồn tại trên Render chưa bằng cách thử login
    try:
        login_res = requests.post(f"{RENDER_URL}/login", json={
            "email": u['email'],
            "password": u['password']
        }, timeout=30)
        
        if login_res.status_code == 200:
            render_id = login_res.json()['user']['id']
            render_user_id_map[u['id']] = render_id
            print(f"   ✅ Đã tồn tại (Render ID={render_id}) - bỏ qua")
            
            # Cập nhật lat/lng nếu có
            if u.get('lat') and u.get('lng'):
                update_res = requests.patch(f"{RENDER_URL}/users/{render_id}", json={
                    'lat': u['lat'], 'lng': u['lng'],
                    'reward_points': u.get('reward_points', 0)
                }, timeout=30)
                if update_res.status_code == 200:
                    print(f"   📍 Cập nhật lat/lng thành công")
            continue
    except Exception as e:
        pass

    # Tạo mới nếu chưa tồn tại
    if u['role'] == 'donor':
        payload = {
            "fullName": u['name'],
            "email": u['email'],
            "phone": u['phone'],
            "password": u['password'],
            "address": u['address'] or "",
            "bloodType": u.get('blood_type') or "Chưa biết"
        }
        res = requests.post(f"{RENDER_URL}/register_donor", json=payload, timeout=30)
        
    elif u['role'] in ['hospital', 'admin']:
        # Dùng endpoint đặc biệt để tạo admin/hospital 
        payload = {
            "name": u['name'],
            "email": u['email'],
            "phone": u['phone'],
            "password": u['password'],
            "role": u['role'],
            "address": u['address'] or ""
        }
        res = requests.post(f"{RENDER_URL}/create_user_admin", json=payload, timeout=30)
        
        if res.status_code == 404:
            # Endpoint không tồn tại, bỏ qua (admin đã được seed)
            print(f"   ⚠️  Không có endpoint tạo {u['role']} - bỏ qua (đã seed bởi startup.py)")
            continue
    else:
        print(f"   ⚠️  Role không xác định: {u['role']}")
        continue

    if res.status_code in [200, 201]:
        data = res.json()
        render_id = data.get('user', {}).get('id')
        if render_id:
            render_user_id_map[u['id']] = render_id
            print(f"   ✅ Tạo thành công (Render ID={render_id})")
            
            # Cập nhật lat/lng nếu có
            if u.get('lat') and u.get('lng'):
                requests.patch(f"{RENDER_URL}/users/{render_id}", json={
                    'lat': u['lat'], 'lng': u['lng'],
                    'reward_points': u.get('reward_points', 0)
                }, timeout=30)
    else:
        print(f"   ❌ Lỗi: {res.status_code} - {res.text[:200]}")

print()
print("=== KẾT QUẢ ===")
print(f"ID mapping: {render_user_id_map}")
print("\n✅ Migrate users hoàn tất!")

conn.close()
