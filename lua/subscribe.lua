local utils = require "utils"
local driver = require "luasql.postgres"
local env = assert (driver.postgres())
local con = assert(env:connect("postgresql://MATERIALIZE_USERNAME:MATERIALIZE_PASSWORD@MATERIALIZE_HOST:6875/materialize?sslmode=enabled"))
con:setautocommit(false)

assert (con:execute("DECLARE c CURSOR FOR SUBSCRIBE (SELECT sum FROM counter_sum) WITH (PROGRESS);"))

while(true) do
    for mz_timestamp, mz_progressed, mz_diff, sum in utils.rows(con,"FETCH ALL c") do
        -- Map row fields
        local ts = row.mz_timestamp
        local progress = row.mz_progressed
        local diff = row.mz_diff
        local rowData = { sum }

        -- When a progress is detected, get the last values
        if progress then
            if updated then
            updated = false
            print(table.concat(state.getValues(), ','))
            end
        else
            -- Update the state with the last data
            updated = true
            local update = {
            value = rowData,
            diff = tonumber(diff)
            }
            local timestamp = tonumber(ts)
            local success, err = pcall(state.update, state, update, timestamp)
            if not success then
            print(err)
            end
        end

        print(string.format("%s %s, %s:%s", mz_timestamp, mz_progressed, mz_diff, sum))
    end
end

con:commit()
con:close()

con:close()
env:close()
