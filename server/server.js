const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = 5001;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Connexion à la base de données MongoDB
const connectDB = async (selectedFilter) => {
  const client = await MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client.db("BigData").collection("150_"+selectedFilter);
};


app.get("/bestDeck/:granularity/:selectedGranularity/:selectedK/:selectedFilter", async (req, res) => {
  try {
    const granularity = req.params.granularity;
    const selectedGranularity = parseInt(req.params.selectedGranularity);
    const selectedK = parseInt(req.params.selectedK);
    const selectedFilter = req.params.selectedFilter;



    if (
      granularity !== "all" &&
      granularity !== "week" &&
      granularity !== "month"
    ) {
      return res.status(400).json({ message: "Granularité invalide" });
    }

    // Connexion à la base de données
    const collection = await connectDB(selectedFilter);

    // Filtrer et trier les données en fonction de la granularité et de la condition de combinaison
    let filter = {};
    if (granularity === "all") {
      filter = {
        $and: [{ week: -1 }, { month: -1 }, { combination: { $size: 8 } }],
      };
    } else if (granularity === "week") {
      filter = {
        $and: [{ week: selectedGranularity }, { combination: { $size: 8 } }],
      };
    } else if (granularity === "month") {
      filter = {
        $and: [{ month: selectedGranularity }, { combination: { $size: 8 } }],
      };
    }

    let sort = {
      wins: -1,
    };

    if(selectedFilter === "U"){
      sort = {
        uses: -1,
      };
    }
    else if(selectedFilter === "AVG"){
      sort = {
        avg_deck_diff: 1,
      };
    }
    else if(selectedFilter === "P"){
      sort = {
        distinct_player_count: -1,
      };
    }



    const result = await collection.find(filter).sort(sort).limit(selectedK).toArray();

    res.json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des données" });
  }
});

// Endpoint pour /ngram/{granularity}/{selectedGranularity}
app.get(
  "/ngram/:selectedCards/:granularity/:selectedGranularity/:selectedK/:selectedFilter",
  async (req, res) => {
    try {
      const selectedCards = req.params.selectedCards;
      const selectedK = parseInt(req.params.selectedK);
      const selectedFilter = req.params.selectedFilter;

      const cards = selectedCards
        .split(",")
        .map((card) => card.replace("[", "").replace("]", "").trim())
        .map((card) => parseInt(card));
      cards.sort((a, b) => a - b);
      const granularity = req.params.granularity;
      const selectedGranularity = parseInt(req.params.selectedGranularity);

      if (
        granularity !== "all" &&
        granularity !== "week" &&
        granularity !== "month"
      ) {
        return res.status(400).json({ message: "Granularité invalide" });
      }

      // Connexion à la base de données
      const collection = await connectDB(selectedFilter);

      let sort = {
        wins: -1,
      };
      let project = {};
      let filter = {};
      if (granularity === "all") {
        filter = {
          $and: [{ week: -1 }, { month: -1 }, { combination: cards }],
        };
      } else if (granularity === "week") {
        if (selectedGranularity === -1) {
          filter = {
            $and: [{ combination: cards, week :{$ne:-1} }],
          };
          sort = {
            year: 1,
            month: 1,
          };
          project = {
            _id: 0,
            year: 1,
            week: 1,
            wins: 1,
            uses: 1,
            avg_deck_diff: 1,
            distinct_player_count: 1,
          };
        } else
          filter = {
            $and: [{ week: selectedGranularity }, { combination: cards }],
          };
      } else if (granularity === "month") {
        if (selectedGranularity === -1) {
          filter = {

            $and: [{ combination: cards, month: { $ne: -1 } }],
          };
          sort = {
            year: 1,
            month: 1,
          };
          project = {
            _id: 0,
            year: 1,
            month: 1,
            wins: 1,
            uses: 1,
            avg_deck_diff: 1,
            distinct_player_count: 1,

          };
        } else
          filter = {
            $and: [{ month: selectedGranularity }, { combination: cards }],
          };
      }

      const result = await collection.find(filter).limit(selectedK).project(project).sort( sort ).toArray();

      res.json(result);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des données" });
    }
  }
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
