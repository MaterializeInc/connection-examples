local dump = require('utils').dump
local driver = require "luasql.postgres"
local env = assert (driver.postgres())
local con = assert(env:connect("postgresql://MATERIALIZE_USERNAME:MATERIALIZE_PASSWORD@MATERIALIZE_HOST:6875/materialize?sslmode=enabled"))

con:execute[[
CREATE VIEW market_orders_2 AS
    SELECT val->>'symbol' AS symbol,
           (val->'bid_price')::float AS bid_price
    FROM (SELECT text::jsonb AS val FROM market_orders_raw_2)
]]

local cur = assert (con:execute"SHOW VIEWS")
local row = cur:fetch({}, 'a')
while row do
    print(dump(row))
    row = cur:fetch({}, 'a')
end

cur:close()
con:close()
env:close()
