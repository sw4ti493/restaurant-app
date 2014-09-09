Parse.initialize("0CvaUuN15ZEEUOih8x4FXx82V85Tq162yvsAOyLL", "aJ2A8q3bktTiX4GS7vLu5UNLyQm7RDcCl3SWLer0");

$(document).ready(function(){
    $(function() {

        $("#resListContainer").on("click", ".restaurant", function () {
            $(".item").hide().filter("[data-source=" + this.id + "]").show();
        });

        $("#notes").on("keyup", function () {
            $("#notesCounter").text($(this).val().length);
            $("#notes").css("background-color", this.value.length > 10 ? "#ff7777" : "#fff");

            //if (this.value.length > 10) {
            //    $("#notes").css("background-color", "#ff7777");
            //} else {
            //    $("#notes").css("background-color", "#fff");
            //}
        });

        var source = $("#resList").html();
        var template = Handlebars.compile(source);

        var refreshList = function (data) {
            var html = template(data);
            $("#resListContainer").html(html);
        };


        var Restaurant = Parse.Object.extend("Restaurant");
        var query = new Parse.Query(Restaurant);
        query.find({
            success: function (results) {
                var context = { list: results };
                refreshList(context);

//                var restaurants = [];
//                console.log(results);
//                results.forEach(function (r, i) {
//                    a = $("<a/>", { class: 'restaurant', id: r.id, text: r.attributes.name });
//                    restaurants.push($("<li />").append(a));
//                });
//
//                $("#resList").append(restaurants);
            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });

        var sourceTwo = $("#itemList").html();
        var templateTwo = Handlebars.compile(sourceTwo);

        var refreshListTwo = function (data) {
            var htmlTwo = templateTwo(data);
            $("#itemListContainer").html(htmlTwo);
        }

        var MenuItem = Parse.Object.extend("MenuItem");
        var query1 = new Parse.Query(MenuItem);
        query1.find({
            success: function (results) {
                var context = { itemList: results };
                refreshList(context);

//                var li, menuItem = [];
//
//                results.forEach(function (mi, i) {
//                    var cb = $("<input />", { "type": "checkbox", "class": "checked", "data-price": mi.attributes.price });
//                    menuItem.push($("<li />", { "class": 'item', "data-source": mi.attributes.restaurant_id }).append(cb).append(" " + mi.attributes.title).append(" $" + mi.attributes.price));
//                });
//
//                $("#itemList").append(menuItem);

                var sum = 0;
                $(".checked").on("click", function () {
                    if ($(this).is(':checked')) {
                        sum = sum + parseInt($(this).attr("data-price"));
                    } else {
                        sum = sum - parseInt($(this).attr("data-price"));
                    }

                    $("#count").text($("input:checked").length + " item(s)");
                    $("#total").text("Total: $" + sum);

                })


                $(".item").hide();

                $("#resList").on("change", function (event) {

                    $("option:selected").each(function () {
                        $(".item").hide().filter("[data-source=" + this.id + "]").show();
                    });
                    $("option:selected").hide().filter("[data-source=" + this.id + "]").show();
                    $("li").each(function () {
                        $(this).children('input')[0].checked = false;
                    });

                    sum = 0;
                    $("#count").text($("input:checked").length + " item(s)");
                    $("#total").text("Total: $" + sum);

                })
            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });


        //parsedata();

        var newOrder = function (email, notes, phone_number, menu_item) {
            var submit = Parse.Object.extend("Order");
            var menu = new submit();

            menu.set("email_address", email);
            menu.set("notes", notes);
            menu.set("phone_number", phone_number);
            menu.set("menu_item", menu_item);

            menu.save(null, {
                success: function (menu) {

                },
                error: function (menu, error) {

                }
            });
        };

        $('#submit').on('click', function (e) {
            e.preventDefault();
            var user = $('.user');
            var phone = user.find("#phone").val();
            var email = user.find("#email").val();
            var note = user.find("#notes").val();
            var menu_item = [];
            $('#itemList  li').each(function () {
                if ($(this).children('input')[0].checked) {
                    menu_item.push($(this).text());
                }
            });
            menu_item = menu_item.join(",");

            newOrder(email, note, phone, menu_item);
        });

        $('.button').click(function () {
            window.location.href = 'orders.html';
        });

        var order = Parse.Object.extend("Order");
        var query3 = new Parse.Query(order);
        query3.find({
            success: function (results) {
                results.forEach(function (o, i) {
                    $('tbody').prepend("<tr><td>" + o.attributes.menu_item + " </td><td>" + o.attributes.email_address + "</td><td> " + o.attributes.phone_number + " </td><td> " + o.attributes.notes + " </td> </tr>");
                });
                console.log(results);
            },

            error: function (err) {

            }
        });

        $('#tinySort').on("click", function () {
            $('tbody tr').tsort("td");
            alert(this);
        });
    })
});
