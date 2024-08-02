local isMinigameActive = false

local startGame = function(mines, multiplier)
    if isMinigameActive then return nil end

    isMinigameActive = true
    local success = false
    local score = 0.0

    SetNuiFocus(true, true)
    SendNUIMessage({ action = "startGame", mines = mines, multiplier = multiplier })

    local promise = promise.new()

    RegisterNUICallback('endGame', function(data, cb)
        success = data.status
        isMinigameActive = false
        score = data.score
        cb('ok')
        promise:resolve(success)
        SetNuiFocus(false, false)
    end)

    return Citizen.Await(promise), score
end

exports('startGame', startGame)

RegisterCommand('mines-test', function()
    local result, count = exports['cave_mines']:startGame(5, 1.2)
    if result then
        print(count)
        print('Completed')
    else
        print('Failed')
    end
end)
