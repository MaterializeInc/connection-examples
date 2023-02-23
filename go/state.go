package main

import (
	"encoding/json"
	"errors"
)

type Update struct {
	Key   string      `json:"key,omitempty"`
	Value interface{} `json:"value"`
	Diff  int         `json:"diff"`
}

type State struct {
	state      map[string]interface{}
	stateCount map[string]int
	timestamp  int64
	valid      bool
	history    []Update
}

func NewState(collectHistory bool) *State {
	s := &State{
		state:      make(map[string]interface{}),
		stateCount: make(map[string]int),
		timestamp:  0,
		valid:      true,
	}
	if collectHistory {
		s.history = []Update{}
	}
	return s
}

func (s *State) Get(key string) interface{} {
	return s.state[key]
}

func (s *State) GetKeys() []string {
	keys := make([]string, len(s.state))
	i := 0
	for k := range s.state {
		keys[i] = k
		i++
	}
	return keys
}

func (s *State) GetValues() []interface{} {
	values := make([]interface{}, len(s.state))
	i := 0
	for _, v := range s.state {
		values[i] = v
		i++
	}
	return values
}

func (s *State) IsValid() bool {
	return s.valid
}

func (s *State) GetTimestamp() int64 {
	return s.timestamp
}

func (s *State) GetHistory() []Update {
	return s.history
}

func (s *State) ApplyDiff(key string, diff int) {
	if _, ok := s.stateCount[key]; !ok {
		s.stateCount[key] = diff
	} else {
		s.stateCount[key] += diff
	}
}

func (s *State) Hash(value interface{}) string {
	bytes, _ := json.Marshal(value)
	return string(bytes)
}

func (s *State) Validate(timestamp int64) error {
	if !s.valid {
		return errors.New("Invalid state.")
	} else if timestamp < s.timestamp {
		s.valid = false
		return errors.New("Invalid timestamp.")
	}
	return nil
}

func (s *State) Process(update Update) {
	key := update.Key
	if key == "" {
		key = s.Hash(update.Value)
	}
	s.ApplyDiff(key, update.Diff)
	count := s.stateCount[key]

	if len(s.history) > 0 {
		s.history = append(s.history, update)
	}

	if count <= 0 {
		delete(s.state, key)
		delete(s.stateCount, key)
	} else {
		s.state[key] = update.Value
	}
}

func (s *State) Update(update Update, timestamp int64) error {
	if err := s.Validate(timestamp); err != nil {
		return err
	}
	s.timestamp = timestamp
	s.Process(update)
	return nil
}

func (s *State) BatchUpdate(updates []Update, timestamp int64) error {
	if len(updates) == 0 {
		return nil
	}
	if err := s.Validate(timestamp); err != nil {
		return err
	}
	s.timestamp = timestamp
	for _, update := range updates {
		s.Process(update)
	}
	return nil
}