var cookie = {
    set: function (name, value, daysToLive) {
        var cookie = name + "=" + encodeURIComponent(value);

        if (typeof daysToLive === "number") {
            cookie += "; max-age=" + (daysToLive * 24 * 60 * 60);
        }

        document.cookie = cookie;
    },

    get: function (name) {
        var cookies = document.cookie.split(";").map(function (cookie) {
            return cookie.trim();
        });

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var separatorIndex = cookie.indexOf("=");
            var cookieName = cookie.slice(0, separatorIndex);

            if (cookieName === name) {
                return decodeURIComponent(cookie.slice(separatorIndex + 1));
            }
        }

        return null;
    },

    delete: function (name) {
        document.cookie = name + "=; max-age=0";
    },

    exists: function (name) {
        var cookies = document.cookie.split(";").map(function (cookie) {
            return cookie.trim();
        });

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var separatorIndex = cookie.indexOf("=");
            var cookieName = cookie.slice(0, separatorIndex).trim();

            if (cookieName === name) {
                return true;
            }
        }

        return false;
    }
};


function save() {
    const authKey = document.getElementById("authKey").value;
    cookie.set("authKey", authKey, 365);
    const confirm = document.createElement("p");
    confirm.textContent = "Saved!";
    confirm.classList.add("label-text");
    document.body.appendChild(confirm);
}    
