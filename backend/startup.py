#!/usr/bin/env python3
"""
Script khởi động cho Render.com
- Tạo bảng database nếu chưa có
- Seed tài khoản mặc định nếu DB trống
"""
from app import app, db, User, Hospital

with app.app_context():
    # Tạo tất cả bảng
    db.create_all()
    print("✅ Database tables created/verified!")

    # Tạo tài khoản admin nếu chưa có
    admin = User.query.filter_by(role='admin').first()
    if not admin:
        admin = User(
            name='Admin',
            email='admin@giotam.com',
            phone='0123456789',
            password='admin',
            role='admin',
            address='Hệ thống Giọt Ấm'
        )
        db.session.add(admin)
        print("✅ Đã tạo tài khoản admin!")

    # Tạo tài khoản bệnh viện mẫu nếu chưa có
    hospital_user = User.query.filter_by(email='benhviendanang@gmail.com').first()
    if not hospital_user:
        hospital_user = User(
            name='Bệnh viện Đà Nẵng',
            email='benhviendanang@gmail.com',
            phone='02363821118',
            password='benhviendanang',
            role='hospital',
            address='124 Hải Phòng, Hải Châu, Đà Nẵng',
            lat=16.0544068,
            lng=108.2021667
        )
        db.session.add(hospital_user)
        print("✅ Đã tạo tài khoản bệnh viện (users table)!")

    # Tạo bản ghi Hospital trong bảng hospitals (dùng cho create_alert)
    hospital_record = Hospital.query.filter_by(name='Bệnh viện Đà Nẵng').first()
    if not hospital_record:
        hospital_record = Hospital(
            name='Bệnh viện Đà Nẵng',
            lat=16.0544068,
            lng=108.2021667
        )
        db.session.add(hospital_record)
        print("✅ Đã tạo Hospital record (hospitals table)!")

    db.session.commit()
    print("✅ Seed data hoàn tất!")
    print(f"   Admin ID: {admin.id if admin else 'existing'}")
    print(f"   Hospital user ID: {hospital_user.id if hospital_user else 'existing'}")
    print(f"   Hospital record ID: {hospital_record.id if hospital_record else 'existing'}")
