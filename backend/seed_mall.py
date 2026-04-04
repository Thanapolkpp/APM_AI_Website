import os
from sqlalchemy.orm import Session
from app.utils.db import SessionLocal, engine
from app.models.avatar import Avatar
from app.models.room import Room

def seed():
    db: Session = SessionLocal()
    try:
        # Seed Avatars
        avatars = [
            {"name": "Bro", "price": 15, "model_path": "/models/bro.glb"},
            {"name": "Bestie", "price": 15, "model_path": "/models/girl.glb"},
            {"name": "Genius", "price": 15, "model_path": "/models/nerd.glb"},
        ]
        
        for a_data in avatars:
            exists = db.query(Avatar).filter(Avatar.model_path == a_data["model_path"]).first()
            if exists:
                exists.price = a_data["price"]
            else:
                new_avatar = Avatar(**a_data)
                db.add(new_avatar)
                print(f"Added Avatar: {a_data['name']}")
        
        # Seed Rooms
        rooms = [
            {"name": "Nerdroom", "price": 15, "image_path": "NERD_ROOM.png"},
            {"name": "Rock Studio", "price": 15, "image_path": "Rock_Room.png"},
            {"name": "Christmas Night", "price": 15, "image_path": "Chirtmas_room.png"},
        ]
        
        for r_data in rooms:
            # Check for exists by name or image_path
            exists = db.query(Room).filter(Room.image_path == r_data["image_path"]).first()
            if exists:
                exists.price = r_data["price"]
            else:
                new_room = Room(**r_data)
                db.add(new_room)
                print(f"Added Room: {r_data['name']}")
        
        db.commit()
        print("Seeding completed!")
    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
