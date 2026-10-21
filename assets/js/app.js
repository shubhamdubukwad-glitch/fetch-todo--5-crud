var cl = console.log;


const postForm = document.getElementById('postForm')
const title = document.getElementById('title')
const body = document.getElementById('body')
const userID = document.getElementById('userID')
const addPostBtn = document.getElementById('addPostBtn')
const updatePostBtn = document.getElementById('updatePostBtn')
const postConatiner = document.getElementById('postConatiner')
const spinner = document.getElementById('spinner')

//backend-add link//
const BASE_URL = `https://shubham-92216-default-rtdb.asia-southeast1.firebasedatabase.app`;
const POST_URL = `${BASE_URL}/post.json`;

//local-state//(array)
const state = {
    postArr: [],
    EDIT_ID: null,
}
//spiner//
function showspinner() {
    spinner.classList.remove('d-none')
}
function hidespinner() {
    spinner.classList.add('d-none')
}


//read-post//
function templeting(arr) {
    let result = ``;
    arr.forEach(ele => {
        result += `<div class="col-md-3 mt-5 mb-5" id="${ele.id}">
                <div class="card h-100">
                    <div class="card-header">
                        <h1>${ele.title}</h1>
                    </div>
                    <div class="card-body">
                        <p>${ele.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button  onclick="editcard(this)" type="button" class="btn btn-outline-primary">Edit</button>
                        <button onclick="deletecard(this)" type="button" class="btn btn-outline-danger">Remove</button>
                    </div>
                </div>
            </div>`;
    });
    postConatiner.innerHTML = result;
}
//fetch-post//
function fatchpost() {
    showspinner()
    fetch(POST_URL, {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/json",
            "athorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('HTTP ERRPR')
            }
            return res.json()
        })
        .then(data => {
            for (const key in data) {
                data[key].id = key;
                state.postArr.unshift(data[key]);
            }
            templeting(state.postArr)
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hidespinner()
        })
}

fatchpost()

//create-post//
function onaddfetch(eve) {
    eve.preventDefault()
    let postObj = {
        title: title.value,
        body: body.value,
        userID: userID.value,
    }
    showspinner()
    postForm.reset()
    fetch(POST_URL, {
        method: "POST",
        body: JSON.stringify(postObj),
        headers: {
            "content-type": "applicatin/json",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Somthing went wrong in create post..!!')
            }
            return res.json()
        })
        .then(data => {
            postObj.id = data.name;
            let col = document.createElement('div')
            col.className = `col-md-3 mt-5 mb-5`;
            col.id = postObj.id;
            col.innerHTML = `<div class="card h-100">
                    <div class="card-header">
                        <h1>${postObj.title}</h1>
                    </div>
                    <div class="card-body">
                        <p>${postObj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="editcard(this)" type="button" class="btn btn-outline-primary">Edit</button>
                        <button onclick="deletecard(this)" type="button" class="btn btn-outline-danger">Remove</button>
                    </div>
                </div>`;
            postConatiner.prepend(col)
            postForm.reset()
            Swal.fire({
                title: "POST CREATED SUCCESSFULLY..!!",
                text: "You post card created has been successfully..!!",
                icon: "success",
                timer: 4000
            });
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hidespinner()
        })
}
//delete-post//
function deletecard(ele) {
    let delete_id = ele.closest('.col-md-3').id;
    showspinner()
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let delete_url = `${BASE_URL}/post/${delete_id}.json`;
            fetch(delete_url, {
                method: "DELETE",
                body: null,
                headers: {
                    "content-type": "application/json",
                    "Athorization": "TOKEN JWT FROM LS",
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('somthing want wrong in delete post..?')
                    }
                    return res.json();
                })
                .then(data => {
                    let getIndex = state.postArr.findIndex(p => p.id === delete_id);
                    state.postArr.splice(getIndex, 1)
                    ele.closest('.col-md-3').remove()

                    Swal.fire({
                        title: "CARD DELETED SUCCESSFULLY..!!",
                        text: "Your card has been deleted successfully ..!",
                        icon: "success",
                        timer: 4000
                    });
                })
                .catch(err => {
                    cl(err)
                })
                .finally(() => {
                    hidespinner()
                })
        }else{
            hidespinner()
        }

    });
}
//edit-post//
function editcard(ele) {
    let EDIT_ID = ele.closest('.col-md-3').id;
    showspinner()
    //cl(EDIT_ID)
    state.EDIT_ID = EDIT_ID;
    let edit_url = `${BASE_URL}/post/${EDIT_ID}.json`

    fetch(edit_url, {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/json",
            "Athorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('somthing went wrong in edit card..!!')
            }
            return res.json()
        })
        .then(data => {
            // cl(data)
            title.value = data.title;
            body.value = data.body;
            userID.value = data.userID;

            addPostBtn.classList.add('d-none');
            updatePostBtn.classList.remove('d-none');

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hidespinner()
        })

}
//update-post//
function onUpdatepost() {
    let updateId = state.EDIT_ID;
    let update_url = `${BASE_URL}/post/${updateId}.json`;
    let updateObj = {
        title: title.value,
        body: body.value,
        userID: userID.value,
    }
    showspinner()
    fetch(update_url, {
        method: 'PATCH',
        body: JSON.stringify(updateObj),
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('somthiong went wrong in update...!!')
            }
            return res.json()
        })

        .then(data => {
            let col = document.getElementById(updateId)
            col.innerHTML = `<div class="card h-100">
                    <div class="card-header">
                        <h1>${updateObj.title}</h1>
                    </div>
                    <div class="card-body">
                        <p>${updateObj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="editcard(this)" type="button" class="btn btn-outline-primary">Edit</button>
                        <button onclick="deletecard(this)" type="button" class="btn btn-outline-danger">Remove</button>
                    </div>
                </div>`;

            addPostBtn.classList.remove('d-none');
            updatePostBtn.classList.add('d-none');
            postForm.reset()
            Swal.fire({
                title: "POST UPDATED SUCCESSFULLY..!!",
                text: "You post card updated has been successfully..!!",
                icon: "success",
                timer: 4000
            });
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hidespinner()
        })
}


postForm.addEventListener('submit', onaddfetch);
updatePostBtn.addEventListener('click', onUpdatepost)