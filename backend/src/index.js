import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 9000;


app.use(cors(
    {
        origin: true,
        credentials: true,
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
