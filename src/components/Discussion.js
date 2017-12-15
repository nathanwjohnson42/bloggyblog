import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import axios from 'axios'
import ReactQuill from 'react-quill'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { GridList } from 'material-ui/GridList'
import Snackbar from 'material-ui/Snackbar';
import '../css/quill.snow.css'

const styles = {
    width: '100%',
    height: 450,
    overflowY: 'auto',
}
const rootStyle = {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
}

class Discussion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            body: '',
            name: '',
            messageData: undefined,
            open: false,
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                    ['link', 'image'],
                    ['clean']
                ],
            },
            formats: [
                'header',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent',
                'link', 'image'
            ],
        }
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
    }
    handleTextChange = (value) => {
        this.setState({
            body: value,
        })
        axios.get('/getmessage')
            .then((res) => {
                this.setState({
                    messageData: res.data
                })
                console.log(this.state.messageData)
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    handleNameChange = (event) => {
        this.setState({
            name: event.target.value
        })
    }
    handleMessagePost = (event) => {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        today = yyyy + '-' + mm + '-' + dd;
        axios.post('/postmessage', {
            body: this.state.body,
            name: this.state.name,
            date: today
        }).then(function (res) {
            console.log(res)
        }).catch(function (error) {
            console.log(error)
            alert("error! try again")
        })
        this.setState({
            body: '',
            // name: ''
            open: true,
        })
    }

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    componentWillMount() {
        axios.get('/getmessage')
            .then((res) => {
                this.setState({
                    messageData: res.data
                })
                console.log(this.state.messageData)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    render() {
        const data = this.state.messageData
        console.log(data)
        let messages = data && data.map(group => {
            function getAuthor(author) {
                let authorName = author
                if (!author) {
                    return 'Anonymous'
                } else {
                    return authorName
                }
            }
            return (
                <div>
                    <Card>
                        <CardTitle title={getAuthor(group.author_name)} subtitle={group.message_date} />
                        <CardText>
                            {data ? <div dangerouslySetInnerHTML={{ __html: group.message_body }} /> : undefined}
                        </CardText>
                    </Card>

                </div>
            )
        })

        return (
            <div className="container">
                <h1 className="appName">Discussion</h1>
                <div style={rootStyle}>
                    <GridList
                        style={styles}
                        cols={1}
                        cellHeight='auto'
                    >
                        {messages}
                    </GridList>
                </div>
                <Paper zDepth={4}>
                    <TextField
                        maxLength='16'
                        primary="true"
                        hintText="Your Name"
                        floatingLabelText="Your Name"
                        value={this.state.name}
                        onChange={this.handleNameChange} />

                    <ReactQuill value={this.state.body}
                        modules={this.state.modules}
                        formats={this.state.formats}
                        placeholder='start typing...'
                        onChange={this.handleTextChange}>
                    </ReactQuill>
                    <RaisedButton
                        onClick={this.handleMessagePost}
                        label="Send Message"
                        primary={true}
                        icon={<i className="far fa-paper-plane fa-fw" />}
                    />
                    <Snackbar
                        open={this.state.open}
                        message="Message Sent!"
                        autoHideDuration={4000}
                        onRequestClose={this.handleRequestClose}
                    />
                </Paper>
            </div >
        )
    }
}

export default Discussion