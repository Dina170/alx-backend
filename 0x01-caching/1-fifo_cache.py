#!/usr/bin/env python3
"""Defines FIFO caching class"""
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """FIFO caching class"""

    def __init__(self):
        """Initialize"""
        super().__init__()
        self.keys = []

    def put(self, key, item):
        """ Add an item in the cache
        """
        if key and item:
            self.cache_data[key] = item
            if key not in self.keys:
                self.keys.append(key)
            if len(self.keys) > BaseCaching.MAX_ITEMS:
                discarded_key = self.keys.pop(0)
                del self.cache_data[discarded_key]
                print(f"DISCARD: {discarded_key}")

    def get(self, key):
        """ Get an item by key
        """
        if key in self.cache_data:
            return self.cache_data.get(key)
        return None
