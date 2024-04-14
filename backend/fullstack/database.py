# Database ORM classes and initialization

# This "trick" lets us hide non-public members from the class when it is imported.
# Each table class is added to __all__ using .append().
# The visible API will consist only of Context, the initialize method, and the table classes.
__all__ = ['Context', 'initialize']

import datetime

from peewee import *
from threading import Lock

_tables = [] # list to hold list of table names

_database = SqliteDatabase(None)
_database.init('/data/shop.db')

create_lock = Lock() # used to ensure only one thread tries to create_tables

def table(cls): # decorator function, just decoarate any class with this and it is recognized as a table.
    if cls not in _tables:
        _tables.append(cls)
        __all__.append(cls.__name__)
    return cls

class Context:
    """Reprsents a connection to the database."""

    # This class follows the enter/exit pattern and thus should be uesd like this:
    #
    # with Context():
    #     ..do some stuff..
    #
    # All changes are always committed when you end the with block.
    # To do transactions and rollbacks you can do them manually using the db object.
    # If you rollback a transaction within the with block that data won't get committed.

    def __init__(self):
        self._database = _database

    @property
    def db(self):
        return self._database

    def __enter__(self):
        self._database.connect(reuse_if_open=True)
        self.ensure_created()
        return self

    def ensure_created(self):
        create_lock.acquire()
        try:
            self._database.create_tables(_tables)
        finally:
            create_lock.release()

    def __exit__(self, exception_type, exception_value, exception_traceback):
        self._database.commit()
        self._database.close()

class BaseModel(Model):
    # This lets us predefine the metadata for all table classes rather than repeating it. (DRY)
    class Meta:
        database = _database

@table
class ShopItem(BaseModel):
    """Represents an item in the shopping list."""    
    id = AutoField(primary_key=True)                        # automatic primary key  
    item = CharField()                                      # the item
    add_date = DateTimeField()                              # date item was added
    checked = BooleanField()                                # has item been checked off?
    checked_date = DateTimeField(null=True)                 # date item was checked off
    deleted = BooleanField(default=False)                   # has item been deleted?

# This code initializes the database with a handful of entries if none exist.
# It will run anytime database is imported.
with Context() as ctx:
    # Get count of records in ShopItem table
    count = ShopItem.select().count()
    if count == 0:
        new_items = ["Apples", "Bananas", "Oranges", "Milk", "Bread", "Cheese", "Eggs"]
        # Add each item as a row
        for item in new_items:
            ShopItem.create(item=item, add_date=datetime.datetime.now(datetime.UTC), checked=False)
        ctx.db.commit()