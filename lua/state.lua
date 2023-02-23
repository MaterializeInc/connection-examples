local State = {}
local json = require('json')
State.__index = State

function State:new(collectHistory)
  local state = {}
  local stateCount = {}
  local timestamp = 0
  local valid = true
  local history

  if collectHistory then
    history = {}
  end

  return setmetatable({
    state = state,
    stateCount = stateCount,
    timestamp = timestamp,
    valid = valid,
    history = history
  }, self)
end

function State:get(key)
  return self.state[key]
end

function State:getKeys()
  local keys = {}
  for key in pairs(self.state) do
    table.insert(keys, key)
  end
  return keys
end

function State:getValues()
  local values = {}
  for _, value in pairs(self.state) do
    table.insert(values, value)
  end
  return values
end

function State:isValid()
  return self.valid
end

function State:getTimestamp()
  return self.timestamp
end

function State:getState()
  -- This assumes that the values are serializable to JSON
  return json.decode(json.encode(self.state))
end

function State:getHistory()
  return self.history
end

function State:apply_diff(key, diff)
  -- Count value starts as a NaN
  if self.stateCount[key] == nil then
    self.stateCount[key] = diff
  else
    self.stateCount[key] = self.stateCount[key] + diff
  end
end

function State:hash(value)
  -- This assumes that the values are serializable to JSON
  return json.encode(value)
end

function State:validate(timestamp)
  if not self.valid then
    error("Invalid state.")
  elseif timestamp < self.timestamp then
    print("Invalid timestamp.")
    self.valid = false
    error(string.format(
      "Update with timestamp (%d) is lower than the last timestamp (%d). Invalid state.",
      timestamp, self.timestamp))
  end
end

function State:process(update)
  local key = update.key or self:hash(update.value)
  self:apply_diff(key, update.diff)
  local count = self.stateCount[key]

  if self.history then
    table.insert(self.history, update)
  end

  if count <= 0 then
    self.state[key] = nil
    self.stateCount[key] = nil
  else
    self.state[key] = update.value
  end
end

function State:update(update, timestamp)
  self:validate(timestamp)
  self.timestamp = timestamp
  self:process(update)
end

function State:batchUpdate(updates, timestamp)
  if type(updates) == 'table' and #updates > 0 then
    self:validate(timestamp)
    self.timestamp = timestamp
    for _, update in ipairs(updates) do
      self:process(update)
    end
  end
end

function State:__tostring()
  -- This assumes that the values are serializable to JSON
  return json.encode(self.state)
end

return State
