import "regenerator-runtime";
import "dotenv/config"
import "./db"
import "./models/Video"
import app from "./server"
import "./models/User"
import "./models/Comment";

const PORT = process.env.PORT || 34872;

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`)

app.listen(PORT, handleListening)