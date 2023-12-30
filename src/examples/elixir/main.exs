defmodule HelloWorld do
  def say do
    IO.puts("Hello, World!!")
  end
end

defmodule XML do
  def list do
    IO.puts("Listing all available XML files!")
    case File.ls("/xml") do
      {:ok, files} ->
        files
        |> Enum.filter(&String.ends_with?(&1, ".xml"))
        |> Enum.each(&IO.puts("\t> #{&1}"))
      {:error, reason} ->
        IO.puts("Error accessing /data: #{reason}")
    end
  end
end

HelloWorld.say()

XML.list()
