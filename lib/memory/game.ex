defmodule Memory.Game do
def new do
  %{
     letterMatrix: false,
     firstSel: false,
     secSel: false,
     clicks: 0,
     revealCount: 0 
  }
end

def client_view(game) do
  game
end

def click(game, letter) do
  game
end

end
