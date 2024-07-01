require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const config = {
  vlcPassword: process.env.VLC_PASSWORD,
  vlcHost: process.env.VLC_HOST || "http://localhost:8080",
  updateDelay: Math.max(1000, process.env.UPDATE_DELAY || 5000),
  metadataFile: {
    title: path.join(__dirname, "meta_title.txt"),
    artist: path.join(__dirname, "meta_artist.txt"),
    publisher: path.join(__dirname, "meta_publisher.txt"),
    description: path.join(__dirname, "meta_description.txt"),
  },
};

async function getVlcMetadata() {
  const metadata = {
    title: "",
    artist: "",
    publisher: "",
    description: "",
  };

  try {
    const response = await axios.get(`${config.vlcHost}/requests/status.json`, {
      auth: {
        username: "",
        password: config.vlcPassword,
      },
    });
    const data = response.data;
    if (
      data.information &&
      data.information.category &&
      data.information.category.meta
    ) {
      const vlcMetadata = data.information.category.meta;

      metadata.title =
        vlcMetadata.title ||
        vlcMetadata.filename ||
        "Music Metadata Unavailable";
      metadata.artist = vlcMetadata.artist || "";
      metadata.publisher = vlcMetadata.publisher || "";
      metadata.description = vlcMetadata.description || "";

      return metadata;
    }
  } catch (error) {
    console.error(`Error retrieving metadata: ${error.message}`);
  }
  metadata.title = "Music Metadata Unavailable";
  return metadata;
}

async function main() {
  while (true) {
    const metadata = await getVlcMetadata();
    fs.writeFileSync(config.metadataFile.title, metadata.title);
    fs.writeFileSync(config.metadataFile.artist, metadata.artist);
    fs.writeFileSync(config.metadataFile.publisher, metadata.publisher);
    fs.writeFileSync(config.metadataFile.description, metadata.description);
    await new Promise((resolve) => setTimeout(resolve, config.updateDelay));
  }
}

main();
