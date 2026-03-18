#!/usr/bin/env python3
"""
Script migrate donation records từ SQLite local lên Render PostgreSQL
Chạy trong app context - ghi thẳng vào Render DB qua SQLAlchemy
"""
import os, sys
sys.path.insert(0, '/app')

from app import app, db, User, DonationRecord
from datetime import date

# Mapping: tên/email local -> thông tin để thêm donation
DONATIONS_TO_MIGRATE = [
    # user_email, donation_date, amount_ml, status
    ("minhtuandoanxxxx@gmail.com", "2026-03-14", 250, "pending"),
    ("minhtuandoanxxxx@gmail.com", "2026-03-14", 250, "pending"),
    ("minhtuandoanxxxx@gmail.com", "2026-03-16", 250, "pending"),
    ("minhtuandoanxxxx@gmail.com", "2026-03-16", 250, "pending"),
    ("minhtuandoanxxxx@gmail.com", "2026-03-17", 250, "pending"),
    ("minhtuandoanxxxx@gmail.com", "2026-03-17", 250, "pending"),
    ("minhtuandoanxxxx@gmail.com", "2026-03-17", 250, "pending"),
    ("minhtuandoanxxxx@gmail.com", "2026-03-17", 250, "pending"),
    ("minhtuandoanxxxx@gmail.com", "2026-03-17", 250, "accepted"),
    ("minhtuandoanxxxx@gmail.com", "2026-03-17", 250, "pending"),
]

with app.app_context():
    print("=== MIGRATE DONATION RECORDS ===\n")
    
    # Kiểm tra nếu đã có records tồn tại
    existing_count = DonationRecord.query.count()
    print(f"Hiện có {existing_count} donation records trên Render DB")
    
    if existing_count > 0:
        print("⚠️  Donation records đã tồn tại, bỏ qua để tránh duplicate!")
    else:
        success = 0
        for email, d_date, amount, status in DONATIONS_TO_MIGRATE:
            user = User.query.filter_by(email=email).first()
            if not user:
                print(f"  ❌ Không tìm thấy user: {email}")
                continue
            
            record = DonationRecord(
                user_id=user.id,
                donation_date=date.fromisoformat(d_date),
                amount_ml=amount,
                status=status
            )
            db.session.add(record)
            success += 1
            print(f"  ✅ Thêm: user={email}, date={d_date}, status={status}")
        
        db.session.commit()
        print(f"\n✅ Hoàn tất: {success}/{len(DONATIONS_TO_MIGRATE)} donation records đã migrate!")

    # Cập nhật lat/lng cho Minh Tuấn
    tuan = User.query.filter_by(email="minhtuandoanxxxx@gmail.com").first()
    if tuan and not tuan.lat:
        tuan.lat = 16.0684634
        tuan.lng = 108.2015392
        tuan.reward_points = 80
        db.session.commit()
        print(f"\n📍 Đã cập nhật lat/lng và reward_points cho {tuan.name}")

    print("\n=== TỔNG KẾT RENDER DB ===")
    print(f"Users: {User.query.count()}")
    print(f"Donation Records: {DonationRecord.query.count()}")
