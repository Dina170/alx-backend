#!/usr/bin/env python3
"""Defines a MRU caching class"""
from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """MRU caching class"""
    def __init__(self):
        super().__init__()
        self.last_key = ''

    def put(self, key, item):
        """ Add an item in the cache
        """
        if key and item:
            self.cache_data[key] = item
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                print("DISCARD: {}".format(self.last_key))
                self.cache_data.pop(self.last_key)
            self.last_key = key

    def get(self, key):
        """ Get an item by key
        """
        if key in self.cache_data:
            self.last_key = key
            return self.cache_data.get(key)
        return None
