sequenceDiagram
    participant browser
    participant server

    Note right of browser: User submits a note and the already fetched JavaScript code adds the new note to the array notes, rerenders the notes and sends the submit to the server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server

    Note right of server: The server creates an new note object based on the data in the POST request body and adds it to the array notes on the server-side

    server-->>browser: {"message": "","note created"}
    deactivate server