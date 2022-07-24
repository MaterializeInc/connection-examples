local dump = require('utils').dump
local driver = require "luasql.postgres"
local env = assert (driver.postgres())
local con = assert(env:connect("postgresql://materialize@localhost:6875/materialize?sslmode=disable"))

con:execute[[
    CREATE SOURCE market_orders_raw_2 FROM PUBNUB
    SUBSCRIBE KEY '377ab04-f100-11e3-bffd-02ee2ddab7fe'
    CHANNEL 'pubnub-market-orders']]

local cur = assert (con:execute"SHOW SOURCES")
local row = cur:fetch({}, 'a')
while row do
    print(dump(row))
    row = cur:fetch({}, 'a')
end

cur:close()
con:close()
env:close()
