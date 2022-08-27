local dump = require('utils').dump
local driver = require "luasql.postgres"
local env = assert (driver.postgres())
local con = assert(env:connect("postgresql://MATERIALIZE_USERNAME:MATERIALIZE_PASSWORD@MATERIALIZE_HOST:6875/materialize?sslmode=enabled"))

con:execute[[
    CREATE SOURCE counter FROM
    LOAD GENERATOR COUNTER']]

local cur = assert (con:execute"SHOW SOURCES")
local row = cur:fetch({}, 'a')
while row do
    print(dump(row))
    row = cur:fetch({}, 'a')
end

cur:close()
con:close()
env:close()
