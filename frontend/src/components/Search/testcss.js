import React, { Component } from 'react';

class Testcss extends Component {
    state = {}
    render() {
        return (
            <div class="row">

                <div class="list-group" id="myList" role="tablist">
                    <a class="list-group-item list-group-item-action active" data-toggle="list" href="#home" role="tab">Home</a>
                    <a class="list-group-item list-group-item-action" data-toggle="list" href="#profile" role="tab">Profile</a>
                    <a class="list-group-item list-group-item-action" data-toggle="list" href="#messages" role="tab">Messages</a>
                    <a class="list-group-item list-group-item-action" data-toggle="list" href="#settings" role="tab">Settings</a>
                </div>


                <div class="tab-content">
                    <div class="tab-pane active" id="home" role="tabpanel">home</div>
                    <div class="tab-pane" id="profile" role="tabpanel">prof</div>
                    <div class="tab-pane" id="messages" role="tabpanel">...</div>
                    <div class="tab-pane" id="settings" role="tabpanel">...</div>
                </div>
            </div>
        );
    }
}

export default Testcss;
