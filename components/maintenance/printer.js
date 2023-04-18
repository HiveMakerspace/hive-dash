import { useState, useEffect } from "react";

import { Typography, Chip, Switch, Button, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";

import MaintenanceItem from "./maintenanceItem.js";
import EventItem from "./eventItem.js";

function Printer(props) {

    const printerName = props.printerName
    const printerData = props.printerData

    const [events, setEvents] = useState([])
    const [statusText, setStatusText] = useState("")

    useEffect(() => {
        fetch(`/api/${printerName}/events`)
            .then(res => res.json())
            .then(data => {
                setEvents(data)
            })
    }, [printerName])

    useEffect(() => {
        if (printerData.status === "down") {
            setStatusText(`down since ${printerData.down_date} :(`)
        } else if (printerData.status === "printing") {
            setStatusText("printing :)")
        } else if (printerData.status === "idle") {
            setStatusText("idle")
        }
    }, [printerData])

    return (
        <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", flexGrow: 1 }}>
                    <Typography variant="h5">{printerName}</Typography>
                    <Typography variant="body2">operational :)</Typography>
                </div>
                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "5px" }}>
                    <Chip label="down" color="error" variant="outlined" size="small" />
                    <Switch />
                </div>
            </div>

            <div style={{ width: "100%", height: "auto", marginTop: "15px", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>

                <div style={{ width: "50%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>

                    <div style={{ width: "auto", height: "32px", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <Typography variant="h6"><strong>Maintenance logs</strong></Typography>
                        <Tooltip arrow title="Add a maintenance event" placement="bottom" >
                            <Button variant="outlined" size="small" startIcon={<Add />}>Add</Button>
                        </Tooltip>
                    </div>

                    <div style={{ width: "100%", height: "auto", padding: "5px 0px", maxHeight: "350px", overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", marginTop: "5px", gap: "10px" }}>

                        <MaintenanceItem />

                    </div>
                </div>

                <div style={{ width: "50%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>

                    <div style={{ width: "auto", height: "32px", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <Typography variant="h6"><strong>Recent events</strong></Typography>
                    </div>

                    <div style={{ width: "100%", height: "auto", padding: "5px 0px", maxHeight: "350px", overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", marginTop: "5px", gap: "10px" }}>

                        {events.map((event) => {
                            if (event.type !== "print_queue") {
                                return (
                                    <EventItem key={event.date} data={event} />
                                )
                            }
                        })}

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Printer