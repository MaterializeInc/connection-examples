from typing import Optional, List, Dict, TypeVar
import json

T = TypeVar('T')

class Update:
    def __init__(self, value: T, diff: int, key: Optional[str] = None):
        self.key = key
        self.value = value
        self.diff = diff

class State:
    def __init__(self, collectHistory: bool = False):
        self.state = {}
        self.stateCount = {}
        self.timestamp = 0
        self.valid = True
        self.history = [] if collectHistory else None

    def get(self, key: str) -> T:
        return self.state[key]

    def getKeys(self) -> List[str]:
        return list(self.state.keys())

    def getValues(self) -> List[T]:
        return list(self.state.values())

    def isValid(self) -> bool:
        return self.valid

    def getTimestamp(self) -> int:
        return self.timestamp

    def getState(self) -> Dict[str, T]:
        return self.state.copy()

    def getHistory(self) -> Optional[List[Update]]:
        return self.history

    def apply_diff(self, key: str, diff: int):
        if key not in self.stateCount:
            self.stateCount[key] = diff
        else:
            self.stateCount[key] += diff

    def hash(self, value: T) -> str:
        return json.dumps(value)

    def validate(self, timestamp: int):
        if not self.valid:
            raise ValueError("Invalid state.")
        elif timestamp < self.timestamp:
            print("Invalid timestamp.")
            self.valid = False
            raise ValueError(f"Update with timestamp ({timestamp}) is lower than the last timestamp ({self.timestamp}). Invalid state.")

    def process(self, update: Update):
        if 'key' in update:
            key = update['key']
        else:
            key = self.hash(update['value'])

        self.apply_diff(key, update['diff'])
        count = self.stateCount[key]

        if self.history is not None:
            self.history.append(update)

        if count <= 0:
            del self.state[key]
            del self.stateCount[key]
        else:
            self.state[key] = update['value']

    def update(self, update: Update, timestamp: int):
        self.validate(timestamp)
        self.timestamp = timestamp
        self.process(update)

    def batchUpdate(self, updates: List[Update], timestamp: int):
        if updates and len(updates) > 0:
            self.validate(timestamp)
            self.timestamp = timestamp
            for update in updates:
                self.process(update)

    def __str__(self):
        return json.dumps(self.state)
