#!/usr/bin/env python3
"""
Script khởi động cho Render.com
- Tạo bảng database nếu chưa có
- Seed tài khoản mặc định nếu DB trống
"""
from app import app, db, User

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
    hospital = User.query.filter_by(email='benhviendanang@gmail.com').first()
    if not hospital:
        hospital = User(
            name='Bệnh viện Đà Nẵng',
            email='benhviendanang@gmail.com',
            phone='02363821118',
            password='benhviendanang',
            role='hospital',
            address='124 Hải Phòng, Hải Châu, Đà Nẵng'
        )
        db.session.add(hospital)
        print("✅ Đã tạo tài khoản bệnh viện mẫu!")

    db.session.commit()
    print("✅ Seed data hoàn tất!")
