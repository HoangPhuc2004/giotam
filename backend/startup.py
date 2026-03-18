#!/usr/bin/env python3
"""
Script khởi động cho Render.com
- Tạo bảng database nếu chưa có
- Chạy với gunicorn (được gọi qua Procfile)
"""
from app import app, db

with app.app_context():
    db.create_all()
    print("✅ Database tables created/verified!")
