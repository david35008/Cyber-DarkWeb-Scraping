import React, { useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Backdrop from '@material-ui/core/Backdrop';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: "absolute",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function KeyWordModal({
    open,
    setOpen,
    keyWordsData,
    fetchKeyWordsData,
}) {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [keyWord, setKeyWord] = useState("");
    const [remove, setRemove] = useState("");

    const addKeyWord = async () => {
        if (keyWord.length > 0) {
            await axios.post("/api/v1/keyword", {
                keyWord,
            });
            setKeyWord("");
            fetchKeyWordsData();
        }
    };

    const removeKeyWord = async () => {
        if (remove) {
            await axios.delete(`/api/v1/keyword/${remove}`);
            setRemove("");
            fetchKeyWordsData();
        }
    };

    const handleClose = () => {
        fetchKeyWordsData();
        setOpen(false);
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}

            >
                <div style={modalStyle} className={classes.paper}>
                    <h2 id="simple-modal-title" style={{ textAlign: "center" }}>
                        KeyWords For Analysis
          </h2>
                    <div style={{ textAlign: "center" }}>KeyWords:</div>
                    <br />
                    <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                        {keyWordsData.length > 0
                            ? keyWordsData.map((keyWord) => {
                                return <Chip key={keyWord.id} label={keyWord.keyWord} />;
                            })
                            : null}
                    </div>
                    <br />
                    <div style={{ textAlign: "center" }}>Enter a KeyWord to Add:</div>
                    <br />
                    <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                        <TextField
                            onChange={(event) => setKeyWord(event.target.value)}
                            value={keyWord}
                            id="keyword-basic"
                            label="KeyWord"
                        />
                        <Button
                            onClick={() => addKeyWord()}
                            variant="contained"
                            color="primary"
                        >
                            Add
            </Button>
                    </div>
                    <br />
                    <div style={{ textAlign: "center" }}>Choose a KeyWord to Delete:</div>
                    <br />
                    <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                        <select
                            onChange={(event) => setRemove(event.target.value)}
                            name="keywords"
                            id="keywords"
                        >
                            <option value="">select...</option>
                            {keyWordsData.length > 0
                                ? keyWordsData.map((keyWord) => {
                                    return (
                                        <option key={keyWord.id} value={keyWord.id}>
                                            {keyWord.keyWord}
                                        </option>
                                    );
                                })
                                : null}
                        </select>
                        <Button
                            onClick={() => removeKeyWord()}
                            variant="contained"
                            color="primary"
                        >
                            Delete
            </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
