defmodule YourProjectName.MixProject do
  use Mix.Project

  def project do
    [
      app: :your_project_name,
      version: "0.1.0",
      elixir: "~> 1.12",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Specify any extra applications you'll use during runtime.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # List your project dependencies here.
  defp deps do
    [
      # Example dependency
      # {:dependency_name, "~> 1.0"}
    ]
  end
end
