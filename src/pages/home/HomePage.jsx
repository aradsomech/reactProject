import { useEffect, useMemo, useState } from "react";
import { Container, Grid } from "@mui/material";
import nextKey from "generate-my-key";
import CardComponent from "../../components/CardComponent";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/ROUTES";
import axios from "axios";
import homePageNormalization from "./homePageNormalization";
import { useSelector } from "react-redux";
import useQueryParams from "../../hooks/useQueryParams";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const HomePage = () => {
  const [dataFromServer, setDataFromServer] = useState([]);
  const navigate = useNavigate();
  const userData = useSelector((bigPie) => bigPie.authSlice.userData);
  const query = useQueryParams();
  console.log(userData);
  useEffect(() => {
    axios
      .get("/cards")
      .then(({ data }) => {
        if (userData) data = homePageNormalization(data, userData._id);
        setDataFromServer(data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);
  // useEffect(() => {
  //   if (!initialDataFromServer.length) return;
  //   const filter = query.filter ? query.filter : "";
  //   setDataFromServer(
  //     initialDataFromServer.filter((card) => card.title.startsWith(filter))
  //   );
  // }, [query, initialDataFromServer]);
  const filteredCards = useMemo(() => {
    if (!dataFromServer.length) return [];
    const filter = query.filter ? query.filter : "";
    // setDataFromServer((current) => {
    return dataFromServer.filter((card) => card.title.startsWith(filter));
    // });
  }, [query, dataFromServer]);
  const handleDeleteCard = (_id) => {
    console.log("_id to delete (HomePage)", _id);
    setDataFromServer((dataFromServerCopy) =>
      dataFromServerCopy.filter((card) => card._id != _id)
    );
    // dataFromServer = dataFromServer.filter((card) => card._id != _id);
    //return true for all the cards that has id that not equal to the id we want to delete
  };
  const handleEditCard = (_id) => {
    navigate(`${ROUTES.EDITCARD}/${_id}`);
  };
  console.log(filteredCards);
  return (
    <Container>
      {filteredCards.length > 1 ? (
        <Grid container spacing={2}>
          {filteredCards.map((card) => (
            <Grid item key={card._id} xs={12} sm={6} md={4} lg={3}>
              <CardComponent
                _id={card._id}
                title={card.title}
                subTitle={card.subtitle}
                phone={card.phone}
                address={`${card.address.city}, ${card.address.street} ${card.address.houseNumber}`}
                img={card.image.url}
                alt={card.image.alt}
                like={card.likes}
                cardNumber={card.cardNumber}
                onDeleteCard={handleDeleteCard}
                onEditCard={handleEditCard}
                createdUser={card.user_id}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
