# This is a minimal Flask application that implements a simple shopping/todo/checkoff list.
# It uses a SQLite database to store the items and their checked status.

import datetime
from typing import List

from flask import Flask, request
from ._version import VERSION
from .database import Context, ShopItem

app = Flask(__name__)

@app.route('/api/v1/items', methods=["GET"])
def get_all_shoplist_items():
    """Return a list of all entries in the list."""
    with Context():
        
        items = ShopItem.select().where(ShopItem.deleted == False)
        print(items)
        return [{"id": item.id, "item": item.item, "checked": item.checked} for item in items]

@app.route('/api/v1/items', methods=["DELETE"])
def delete_all_checked_items():
    """Delete items from the list that are checked."""
    with Context() as ctx:
        items: List[ShopItem] = ShopItem.select().where(ShopItem.checked == True)
        item_count = len(items)
        for item in items:
            item.deleted = True
            ShopItem.save(item)
        ctx.db.commit()
        return str(item_count), 200

@app.route("/api/v1/item", methods=["PUT"])
def add_new_item():
    """Add a new item to the list. The JSON body must include a key of 'item' whose value is the item to add."""
    data = request.get_json()
    if "item" not in data:
        return "", 400 # invalid json
    with Context():
        item = ShopItem.create(item=str(data['item']), add_date=datetime.datetime.now(datetime.UTC), checked=False)
        ShopItem.save(item)
        return "", 201

@app.route("/api/v1/item/<int:item_id>", methods=["POST"])
def toggle_item(item_id: int):
    """Toggle an item either on or off by ID. The state of the given item will be flipped."""
    with Context():
        item = ShopItem.get_by_id(item_id)
        item.checked = not item.checked
        if item.checked:
            # set date
            item.checked_date = datetime.datetime.now(datetime.UTC)
        else:
            item.checked_date = None
        ShopItem.save(item)
        return "", 200
        
@app.after_request
def cors_override(response):
    # This adds all of the necessary CORS headers to all requests.
    # This is not the best practice, as in a production context it could allow misuse of the API.
    # It's fine for our little demo site.
    response.headers["Generated-By"] = f"Fullstack-Demo/{VERSION}"
    response.headers['Access-Control-Allow-Headers'] = '*'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

# The typical "def main/if name is main then main" pattern.
def main():
    app.run(host="0.0.0.0") # If you don't specify the "host" parameter Flask only listens on localhost and thus won't be accessible.
if __name__ == '__main__':
    main()
