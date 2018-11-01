// Landing Page

$("#signup-btn").on('click', function (e) {
    e.preventDefault();
    $(".login-results").html(`<section id="login-wrapper">
            <input type="text" placeholder="Username" class="js-username-auth">
            <input type="password" placeholder="Password" class="js-password-auth">
            <br/>
            <button class="profile-signup">Sign up</button>
    </section>`)
    $('#login-wrapper').show();
    $('#landing-content').hide();
    $('#login-btn').hide();
    $('#signup-btn').hide();
})

$("#login-btn").on('click', function (e) {
    e.preventDefault();
    $(".login-results").html(`<section id="login-wrapper">
            <input type="text" placeholder="Username" class="js-username-auth">
            <input type="password" placeholder="Password" class="js-password-auth">
            <br/>
            <button class="profile-login">Login</button>
    </section>`)
    $('#login-wrapper').show();
    $('#landing-content').hide();
    $('#login-btn').hide();
    $('#signup-btn').hide();
})


function createUser() {
    $('.login-results').on('click', '.profile-signup', function(e){
        e.preventDefault();

        const username = $('.js-username-auth').val();
        const password = $('.js-password-auth').val();

        $.ajax({
            type: 'POST',
            url: '/api/users',
            data: {
                username: username,
                password: password
            },
            success: (data) => {

                $.ajax({
                    method: 'POST',
                    url: '/api/auth/login',
                    data: {
                        username,
                        password
                    },
                    dataType: "json",
                    ContentType: 'application/json',
                    success: function (data) {
                        let jwt = data.authToken;
                        sessionStorage.setItem('Bearer', jwt);
                        const pageName = "./profile.html";
                        $(location).attr('href', pageName);
                    },
                    error: (error) => {
                        if (error) {
                            $('#login-error').html(`<p>You have entered a wrong username or password try again`);
                        }
                    }
                });
            },

            error: function (req, error) {
                console.log("Request: " + JSON.stringify(req));
            }
        });


    });
};

$('.login-results').on('click', '.profile-login', function(event){
    event.preventDefault();

    const username = $('.js-username-auth').val();
    const password = $('.js-password-auth').val();

    
    $.ajax({
        method: 'POST',
        url: '/api/auth/login',
        data: {
            username,
            password
        },
        dataType: "json",
        ContentType: 'application/json',
        success: function (data) {
            let jwt = data.authToken;
            sessionStorage.setItem('Bearer', jwt);
            const pageName = "./profile.html";
            $(location).attr('href', pageName);
        },
        error: (error) => {
            if (error) {
                $('#login-error').html(`<p>You have entered a wrong username or password try again`);
        }
    }
});
});

$('.login-form').submit(function(e){
    e.preventDefault();
})

$(createUser);