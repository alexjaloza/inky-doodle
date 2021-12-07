import React, { useEffect } from "react";
import axios from "axios";
import InkyDoodle from "./InkyDoodle";

const BottomParents = (props) => {
  const {
    parentInkyDoodles,
    bottomTreeLeftParent,
    changeBottomTreeLeftParent,
    bottomTreeRightParent,
    changeBottomTreeRightParent,
    changeBottomGen2,
    changeBottomGen2Loading,
    randomizing,
    changeRandomizing,
  } = props;

  const parentInkyDoodlesQuery = `
    query {
        inkyDoodleCollection(where: {generation_in: 2, parents_contains_all: [${
          leftTreeLeftParent.label
            ? JSON.stringify(leftTreeLeftParent.label)
            : null
        }, ${
    leftTreeRightParent.label ? JSON.stringify(leftTreeRightParent.label) : null
  }]}) {
            items {
                generation
                name
                parents
                image {
                    url
                }
            }
        }
    }
`;

  useEffect(() => {
    const getGen2Function = async () => {
      changeLeftGen2Loading(true);

      const response = await axios({
        url: `https://graphql.contentful.com/content/v1/spaces/${process.env.REACT_APP_SPACE_ID}`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
        },
        data: {
          query: parentInkyDoodlesQuery,
        },
      })
        .then((res) => {
          return res.data;
        })
        .then(({ data, errors }) => {
          changeLeftGen2Loading(false);

          if (errors) {
            console.error(errors);
          }

          changeLeftGen2(data.inkyDoodleCollection.items[0]);
        });

      return response;
    };

    if (bottomTreeLeftParent) {
      if (bottomTreeRightParent) {
        if (bottomTreeLeftParent.name && bottomTreeRightParent.name) {
          if (
            JSON.stringify(bottomTreeLeftParent.name) ===
            JSON.stringify(bottomTreeRightParent.name)
          ) {
            changeLeftGen2(bottomTreeLeftParent);
          } else {
            getGen2Function().then((res) => res);
          }
        } else {
          if (
            JSON.stringify(bottomTreeLeftParent.label) ===
            JSON.stringify(bottomTreeRightParent.label)
          ) {
            changeLeftGen2(bottomTreeLeftParent);
          } else {
            getGen2Function().then((res) => res);
          }
        }
      }
    }
  }, [
    bottomTreeLeftParent,
    bottomTreeRightParent,
    parentInkyDoodlesQuery,
    changeBottomGen2,
    changeBottomGen2Loading,
  ]);

  useEffect(() => {
    if (bottomTreeLeftParent || bottomTreeRightParent) {
      const listenForMenu = setInterval(() => {
        [...document.getElementsByClassName("right_parents")].forEach(
          (item) => {
            if (item) {
              if (item.childNodes) {
                if (item.childNodes[2]) {
                  if (item.childNodes[2].firstChild) {
                    if (
                      item.childNodes[2].firstChild.classList.value.includes(
                        "MenuList"
                      ) ||
                      item.childNodes[2].firstChild.classList.value.includes(
                        "menu"
                      ) ||
                      item.childNodes[2].firstChild.classList.value.includes(
                        "css-1tci6j0"
                      )
                    ) {
                      item.childNodes[2].firstChild.childNodes.forEach((x) => {
                        if (
                          JSON.stringify(x.textContent) ===
                            JSON.stringify(bottomTreeLeftParent.label) ||
                          JSON.stringify(x.textContent) ===
                            JSON.stringify(bottomTreeRightParent.label)
                        ) {
                          const relevantParent = parentInkyDoodles.filter(
                            (parent) =>
                              JSON.stringify(x.textContent) ===
                              JSON.stringify(parent.name)
                          );

                          if (relevantParent) {
                            if (relevantParent.length > 0) {
                              x.style.backgroundColor = `${relevantParent[0].color}77`;
                            }
                          }
                        } else {
                          x.style.backgroundColor = "#FFF";
                        }
                      });
                    }
                  }
                }
              }
            }
          }
        );
      }, 100);

      return () => {
        clearInterval(listenForMenu);
      };
    }
  }, [bottomTreeRightParent, bottomTreeLeftParent, parentInkyDoodles]);

  return (
    <>
      <InkyDoodle
        parentInkyDoodles={parentInkyDoodles}
        bottomTreeLeftParent={bottomTreeLeftParent}
        bottomTreeRightParent={bottomTreeRightParent}
        changeBottomTreeLeftParent={changeBottomTreeLeftParent}
        leftLeft
        randomizing={randomizing}
        changeRandomizing={changeRandomizing}
      />
      <InkyDoodle
        parentInkyDoodles={parentInkyDoodles}
        bottomTreeLeftParent={leftTreeLeftParent}
        bottomTreeRightParent={leftTreeRightParent}
        changeLeftTreeRightParent={changeLeftTreeRightParent}
        leftRight
        randomizing={randomizing}
        changeRandomizing={changeRandomizing}
      />
    </>
  );
};

export default LeftParents;
