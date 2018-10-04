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

  defp setKey(mat, x, y, k, v) do
    entry =
      mat
      |> Enum.fetch!(x)
      |> Enum.fetch!(y)
      |> Map.put(k, v)
    xl =
      mat
      |> Enum.fetch!(x)     
      |> List.replace_at(y, entry)
    List.replace_at(mat, x, xl)
  end

  def donePause(game) do  
    {x0, y0} = game.firstSel
    {x1, y1} = game.secSel
    xy0 = game.letterMatrix
      |> Enum.fetch!(x0)
      |> Enum.fetch!(y0)
    xy1 = game.letterMatrix
      |> Enum.fetch!(x1)
      |> Enum.fetch!(y1)
    if (xy0.name == xy1.name) do
      %{
        letterMatrix: game.letterMatrix
                      |> setKey(x0, y0, :name, false)
                      |> setKey(x1, y1, :name, false),
        firstSel: false,
        secSel: false,
        clicks: game.clicks,
        revealCount: game.revealCount + 2
      }
    else
      %{
        letterMatrix: game.letterMatrix
                      |> setKey(x0, y0, :revealed, false)
                      |> setKey(x1, y1, :revealed, false),
        firstSel: false,
        secSel: false,
        clicks: game.clicks,
        revealCount: game.revealCount
      }
    end
  end

  def click(game, i, j) do
    if (!game.secSel) do
      if (game.firstSel) do
        %{ letterMatrix: setKey(game.letterMatrix, i, j, :revealed, true), 
           firstSel: game.firstSel,
           secSel: {i, j},
           clicks: game.clicks + 1,
           revealCount: game.revealCount}
      else
        %{ letterMatrix: setKey(game.letterMatrix, i, j, :revealed, true), 
           firstSel: {i, j},
           secSel: game.secSel,
           clicks: game.clicks + 1,
           revealCount: game.revealCount}
      end
    else
      game
    end
  end

  def init() do
    arr = ["A", "B", "C", "D", "E", "F", "G", "H"]
    arr = Enum.map(Enum.shuffle(Enum.concat(arr,arr)),
          fn a ->
          %{name: a, revealed: false} end)   
    arr = Enum.chunk_every(arr, 4)
    %{letterMatrix: arr,
     firstSel: false,
     secSel: false,
     clicks: 0,
     revealCount: 0}
  end
def client_view(game) do
  if game.letterMatrix do
    %{ revealed: Enum.map(game.letterMatrix, fn inn ->
                 Enum.map(inn, fn cc ->
                   if cc.revealed do
                     cc.name
                   else
                     case cc.name do
                       false -> false
                       _ -> true
                     end
                   end
                 end)
               end),
       clicks: game.clicks,
       revealCount: game.revealCount,   
       pause: case game.secSel do
                false -> false
                _ -> true
              end
   }
   else 
     %{ revealed: false,
        clicks: game.clicks,
        revealCount: game.revealCount,
        pause: false
     }
   end
end

end
