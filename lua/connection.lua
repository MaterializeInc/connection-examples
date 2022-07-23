local driver = require "luasql.postgres"
local env = assert (driver.postgres())
local con = assert(env:connect("postgresql://materialize@localhost:6875/materialize?sslmode=disable"))

