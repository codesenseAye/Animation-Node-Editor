
-- Handles the interface of the main widget (connecting and displaying an established connection)
-- Handles creating the floating animation widget and removes it when the server says

local RunService = game:GetService("RunService")
local HttpService = game:GetService("HttpService")
local Selection = game:GetService("Selection")

local floatEnum: Enum.InitialDockState = Enum.InitialDockState.Float

local handlerPluginInfo: DockWidgetPluginGuiInfo = DockWidgetPluginGuiInfo.new(floatEnum, true, true, 300, 300, 150, 150)
local connectionHandler: DockWidgetPluginGui = plugin:CreateDockWidgetPluginGui("1", handlerPluginInfo)

local timeLinePluginInfo: DockWidgetPluginGuiInfo = DockWidgetPluginGuiInfo.new(floatEnum, true, true, 700, 200, 150, 150)
local timeLineView: DockWidgetPluginGui = plugin:CreateDockWidgetPluginGui("2", timeLinePluginInfo)

local animatedViewPluginInfo: DockWidgetPluginGuiInfo = DockWidgetPluginGuiInfo.new(floatEnum, true, true, 1080 / 3, 1920 / 3, 1080 / 3, 1920 / 3)
local animatedView: DockWidgetPluginGui = plugin:CreateDockWidgetPluginGui("3", animatedViewPluginInfo)

local connectionBackground: Frame = Instance.new("Frame")
connectionBackground.Size = UDim2.fromScale(1, 1)

connectionBackground.BackgroundColor3 = Color3.fromRGB(51, 51, 51)
connectionBackground.Parent = connectionHandler

animatedView.Title = "Animation Editor - Animated"
timeLineView.Title = "Animation Editor - Timeline"
connectionHandler.Title = "Animation Editor - Handler"

connectionBackground:Clone().Parent = timeLineView

local connect: TextButton = Instance.new("TextButton")
local connecting: boolean = false

connect.Size = UDim2.fromScale(0.75, 0.75)
connect.Position = UDim2.fromScale(0.125, 0.125)
connect.Text = "CONNECT"

local connected: RBXScriptConnection = {}
local isConnected: boolean = false

local function requestServer(body: {any}): (any)
    return HttpService:RequestAsync({
        Url = "http://localhost:1337",
        Method = "POST",
        
        Headers = {
            ["Content-Type"] = "application/json"
        },

        Body = HttpService:JSONEncode(body or {})
    })
end

local function stopStayConnected(): ()
    isConnected = false
    connect.Text = "CONNECT"
        
    for _, connection: RBXScriptConnection in pairs(connected) do
        connection:Disconnect()
    end
end

local function stayConnected(): ()
    local checking: boolean = false
    stopStayConnected()
    
    local function checkConnect(): ()
        local success: boolean = pcall(requestServer)

        if success then
            return
        end

        stopStayConnected()
    end

    table.insert(connected, RunService.RenderStepped:Connect(function(): ()
        if checking then
            return
        end

        checking = true
        checkConnect()
        checking = false
    end))
end

local function buildBodyFromScreenGui(screenGui: ScreenGui): {{className: string, path: string}}
    local body: table = {}
    
    for _, child: GuiObject in pairs(screenGui:GetDescendants()) do
        local path: string = child:GetFullName()
        path = path:sub(path:find(screenGui.Name) + screenGui.Name:len() + 1)

        table.insert(body, {
            className = child.ClassName,
            path = path
        })
    end

    return body
end

local function doConnect(): ()
    stopStayConnected()

    local screenGui = Selection:Get()[1]

    if not screenGui then
        warn("Select a screen gui")
        return
    end

    if not screenGui:IsA("ScreenGui") then
        warn("Select a screen gui")
        return
    end

    connect.Text = "BROADCASTING"

    local success: boolean, response: table? = pcall(function(): any
        return requestServer({isObjects = true, objects = buildBodyFromScreenGui(screenGui)})
    end)

    if not success then
        connect.Text = "CONNECT"
        return
    end

    task.spawn(stayConnected)
    isConnected = true

    connect.Text = "CONNECTED (" .. screenGui.Name .. ")"
end

connect.MouseButton1Down:Connect(function(): ()
    if connecting then
        return
    end

    if isConnected then
        stopStayConnected()
        return
    end

    connecting = true
    doConnect()

    connecting = false
end)

connect.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
connect.Parent = connectionHandler

local aspectRatioConstraint: UIAspectRatioConstraint = Instance.new("UIAspectRatioConstraint")
aspectRatioConstraint.AspectRatio = 1

aspectRatioConstraint.Parent = connect

local uiCorner: UICorner = Instance.new("UICorner")
uiCorner.CornerRadius = UDim.new(0.25, 0)
uiCorner.Parent = connect

local uiStroke: UIStroke = Instance.new("UIStroke")
uiStroke.ApplyStrokeMode = Enum.ApplyStrokeMode.Border
uiStroke.Thickness = 2
uiStroke.Parent = connect

local viewportFrame: ViewportFrame = Instance.new("ViewportFrame")
viewportFrame.Size = UDim2.fromScale(1, 1)
viewportFrame.BackgroundColor3 = Color3.fromRGB(146, 244, 255)

viewportFrame.CurrentCamera = workspace.CurrentCamera
viewportFrame.Parent = animatedView

local worldModel: WorldModel = Instance.new("WorldModel")
worldModel.Parent = viewportFrame

local function doRefresh(): ()
    for _, obj: any in pairs(worldModel:GetChildren()) do
        obj:Destroy()
    end

    for _, obj: any in pairs(workspace:GetChildren()) do
        if obj:IsA("Terrain") or obj:IsA("Camera") then
            continue
        end
    
        obj:Clone().Parent = worldModel
    end
end

local refresh: TextButton = Instance.new("TextButton")
refresh.Size = UDim2.fromScale(0.1, 0.05)

refresh.Position = UDim2.fromScale(0.025, 0.025)
refresh.Text = "REFRESH"

refresh.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
refresh.Parent = animatedView

uiCorner:Clone().Parent = refresh
uiStroke:Clone().Parent = refresh

refresh.MouseButton1Down:Connect(doRefresh)
doRefresh()