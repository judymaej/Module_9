document
  .getElementById("searchBtn")
  .addEventListener("click", async function () {
    const city = document.getElementById("cityInput").value;

    const response = await fetch("/api/weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city }),
    });

    const data = await response.json();
    console.log(data); // Display weather data
  });
// DELETE city from history
app.delete("/api/weather/history/:id", (req, res) => {
  const cityId = req.params.id;

  fs.readFile("searchHistory.json", "utf8", (err, data) => {
    if (err) return res.status(500).json({ message: "Error reading history" });

    const history = JSON.parse(data);
    const updatedHistory = history.filter((city) => city.id !== cityId);

    fs.writeFile(
      "searchHistory.json",
      JSON.stringify(updatedHistory, null, 2),
      (err) => {
        if (err)
          return res.status(500).json({ message: "Error saving history" });
        res.json({ message: "City deleted" });
      }
    );
  });
});
