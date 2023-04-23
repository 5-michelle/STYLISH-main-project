const ManagerDashboard = () => {
    const websiteURLHttp = '3.115.74.105';
    const [messages, setMessages] = React.useState({});
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [reply, setReply] = React.useState('');
    const socket = React.useRef(null);
    const [imageFile, setImageFile] = React.useState(null);
    const fileInputRef = React.useRef();

    React.useEffect(() => {
        // socket.current = new WebSocket('ws://localhost:4000/manager');
        socket.current = new WebSocket(`ws://${websiteURLHttp}/manager`);

        socket.current.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => {
                const userMessages = prevMessages[newMessage.sender] || [];
                return {
                    ...prevMessages,
                    [newMessage.sender]: [...userMessages, newMessage],
                };
            });
        };

        return () => {
            socket.current.close();
        };
    }, []);

    const userList = Object.keys(messages);

    const handleReplyChange = (e) => {
        setReply(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFile({ data: reader.result, name: file.name });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (selectedUser && (reply || imageFile)) {
            const replyMessage = {
                sender: 'Manager',
                content: reply,
                imageURL: null,
            };

            if (imageFile) {
                const formData = new FormData();
                formData.append('file', new File([imageFile], imageFile.name));

                // fetch('http://localhost:4000/upload', {
                //     method: 'POST',
                //     body: formData,
                // })
                //     .then((response) => response.json())
                //     .then((data) => {
                //         replyMessage.imageURL = data.filePath;
                //     })
                //     .catch((error) => {
                //         console.error('Error uploading file:', error);
                //     });
                fetch(`http://${websiteURLHttp}/upload`, {
                    method: 'POST',
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((data) => {
                        replyMessage.imageURL = data.filePath;
                    })
                    .catch((error) => {
                        console.error('Error uploading file:', error);
                    });
            }

            setMessages((prevMessages) => {
                const userMessages = prevMessages[selectedUser] || [];
                return {
                    ...prevMessages,
                    [selectedUser]: [...userMessages, replyMessage],
                };
            });

            socket.current.send(
                JSON.stringify({
                    type: 'managerReply',
                    receiver: selectedUser,
                    content: reply,
                    imageURL: replyMessage.imageURL,
                })
            );
            setReply('');
            setImageFile(null);
        }
    };

    return (
        <div className="manager-dashboard">
            <div className="user-list">
                <h3>Users</h3>
                <ul>
                    {userList.map((user) => (
                        <li key={user} onClick={() => setSelectedUser(user)}>
                            {user}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="message-section">
                <div className="messages">
                    <h3>Messages</h3>
                    {selectedUser ? (
                        <div className="message-container">
                            <h4>{selectedUser}:</h4>
                            <ul>
                                {messages[selectedUser].map((msg, index) => (
                                    <li key={index} className={`message ${msg.sender === 'Manager' ? 'manager-message' : 'client-message'}`}>
                                        {msg.content ? (
                                            msg.content
                                        ) : (
                                            <a
                                                href={`${msg.imageURL}`} // Updated this line
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                &#128279; Click to download
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>Select a user to see their messages and reply</p>
                    )}
                </div>
                {selectedUser && (
                    <form className="reply-form" onSubmit={handleReply}>
                        <label htmlFor="reply">Reply:</label>
                        <input type="text" id="reply" value={reply} onChange={handleReplyChange} />
                        <label htmlFor="image">Image:</label>
                        <input type="file" id="image" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                        <button type="button" onClick={() => fileInputRef.current.click()}>
                            Choose Image
                        </button>
                        {imageFile && <span>{imageFile.name}</span>}
                        <button type="submit">Send</button>
                    </form>
                )}
            </div>
        </div>
    );
};

function App() {
    return (
        <React.Fragment>
            <ManagerDashboard />
        </React.Fragment>
    );
}

ReactDOM.render(<App />, document.querySelector('#root'));
