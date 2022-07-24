local driver = require "luasql.postgres"
local env = assert (driver.postgres())
local con = assert(env:connect("postgresql://materialize@localhost:6875/materialize?sslmode=disable"))

local function rows (connection, sql_statement)
  local cursor = assert (connection:execute (sql_statement))
  return function ()
    return cursor:fetch()
  end
end

for symbol, avg in rows(con, "SELECT * FROM avg_bid") do
    print(string.format("%s:%s", symbol, avg))
end

con:close()
env:close()
