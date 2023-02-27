package main

import (
	"encoding/json"
	"errors"
)

type Update struct {
	Value interface{}
	Diff  int
}

type State struct {
	state     map[string]int
	timestamp int64
	valid     bool
	history   []Update
}

func NewState(collectHistory bool) *State {
	state := make(map[string]int)
	history := []Update{}

	return &State{
		state:     state,
		timestamp: 0,
		valid:     true,
		history:   history,
	}
}

func (s *State) getState() []interface{} {
	list := []interface{}{}

	for key, value := range s.state {
		clone := make(map[string]interface{})
		err := json.Unmarshal([]byte(key), &clone)
		if err != nil {
			continue
		}
		for i := 0; i < value; i++ {
			list = append(list, clone)
		}
	}

	return list
}

func (s *State) getHistory() []Update {
	return s.history
}

func (s *State) validate(timestamp int64) error {
	if !s.valid {
		return errors.New("Invalid state.")
	} else if timestamp < s.timestamp {
		s.valid = false
		return errors.New("Invalid timestamp.")
	}
	return nil
}

func (s *State) process(update Update) {
	// Count value starts as a NaN
	value, err := json.Marshal(update.Value)
	if err != nil {
		return
	}

	count, ok := s.state[string(value)]
	if !ok {
		count = 0
	}

	count += update.Diff

	if count <= 0 {
		delete(s.state, string(value))
	} else {
		s.state[string(value)] = count
	}

	if s.history != nil {
		s.history = append(s.history, update)
	}
}

func (s *State) Update(updates []Update, timestamp int64) error {
	if len(updates) > 0 {
		err := s.validate(timestamp)
		if err != nil {
			return err
		}
		s.timestamp = timestamp
		for _, update := range updates {
			s.process(update)
		}
	}
	return nil
}
