local utils = require "utils"
local driver = require "luasql.postgres"
local env = assert (driver.postgres())
local con = assert(env:connect("postgresql://MATERIALIZE_USERNAME:MATERIALIZE_PASSWORD@MATERIALIZE_HOST:6875/materialize?sslmode=enabled"))
con:setautocommit(false)

assert (con:execute("DECLARE c CURSOR FOR SUBSCRIBE my_view"))

while(true) do
    for timestamp, diff, symbol, avg in utils.rows(con,"FETCH ALL c") do
        print(string.format("%s %s, %s:%s", timestamp, diff, symbol, avg))
    end
end

con:commit()
con:close()

con:close()
env:close()
