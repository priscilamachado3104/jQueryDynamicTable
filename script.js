
/*
  File: script.js
  Priscila Machado, UMass Lowell Computer Science, priscila_machado@student.uml.edu
  Copyright (c) 2026 by Priscila Machado. All rights reserved.
  Created: Jun, 12th, 2026.
  Description: This file validates the form inputs using the jQuery Validation plugin
               and builds a multiplication table based on the values entered by the user.
               If any input is invalid, an error message appears next to that field.
               If all inputs are valid, the table is generated without reloading the page.
 */


$(document).ready(function () {

    // to keep track of how many tabs created
    var tabCount = 0;

    // initialize the tabs
    $("#myTabs").tabs();

    // Connect a slider with its matching textbox
    function bindSliderToInput(sliderId, inputId) {
        $("#" + sliderId).slider({
            min: -50,
            max: 50,
            value: 0,

            // To update while the slider moves
            slide: function (event, ui) {
                $("#" + inputId).val(ui.value);

                // To update the table if the form is valid
                if ($("#Form").valid()) {
                    generateTable();
                }
            }
         });

         // Updates the slider when the user types a value
         $("#" + inputId).on("input", function () {
            var parsed = parseInt($(this).val(), 10);

            if (!isNaN(parsed) && parsed >= -50 && parsed <= 50) {
                $("#" + sliderId).slider("value", parsed);
            }

            if ($("#Form").valid()) {
                generateTable();
            }
        });

    }

    // Connects all sliders to their inputs
    bindSliderToInput("slider-Mincolumn", "Mincolumn");
    bindSliderToInput("slider-Maxcolumn", "Maxcolumn");
    bindSliderToInput("slider-Minrow", "Minrow");
    bindSliderToInput("slider-Maxrow", "Maxrow");
            

    
    
    // rule to check that min column is not greater than max column
    $.validator.addMethod("colMinLessThanMax", function (value, element) {
        var minCol = $("#Mincolumn").val();
        
        // waits until both fields have values
        if (minCol === "" || value === "") {
            return true;
        }
        return parseInt(minCol, 10) <= parseInt(value, 10);
    }, 
    "Minimum column cannot be greater than maximum column.");
    
    // rule to check that minimum row is not greater than maximum row
    $.validator.addMethod("rowMinLessThanMax", function (value, element) {
        var minRow = $("#Minrow").val();
        if (minRow === "" || value === "") {
            return true;
        }
        return parseInt(minRow, 10) <= parseInt(value, 10);
    },
    "Minimum row cannot be greater than maximum row.");
    
    
     // jQuery form validation plugin
    $("#Form").validate({

        // rules for each input field
        rules: {
            Mincolumn: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                
            },
            Maxcolumn: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                colMinLessThanMax: true
            },
            Minrow: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                
            },
            Maxrow: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                rowMinLessThanMax: true
            }
        },

        // error messages for each rule
        messages: {
            Mincolumn: {
                required: "Minimum column is empty. Please enter a whole number between -50 and 50.",
                number:   "Minimum column is not valid. Please enter a whole number, e.g. -10, 0, or 25.",
                min:      "Minimum column is too small. Please enter a value of -50 or greater.",
                max:      "Minimum column is too large. Please enter a value of 50 or less."
            },
            Maxcolumn: {
                required:          "Maximum column is empty. Please enter a whole number between -50 and 50.",
                number:            "Maximum column is not valid. Please enter a whole number, e.g. -10, 0, or 25.",
                min:               "Maximum column is too small. Please enter a value of -50 or greater.",
                max:               "Maximum column is too large. Please enter a value of 50 or less.",
                colMinLessThanMax: "Maximum column must be greater than or equal to minimum column. Please adjust your values."
            },
            Minrow: {
                required: "Minimum row is empty. Please enter a whole number between -50 and 50.",
                number:   "Minimum row is not valid. Please enter a whole number, e.g. -10, 0, or 25.",
                min:      "Minimum row is too small. Please enter a value of -50 or greater.",
                max:      "Minimum row is too large. Please enter a value of 50 or less."
            },
            Maxrow: {
                required:          "Maximum row is empty. Please enter a whole number between -50 and 50.",
                number:            "Maximum row is not valid. Please enter a whole number, e.g. -10, 0, or 25.",
                min:               "Maximum row is too small. Please enter a value of -50 or greater.",
                max:               "Maximum row is too large. Please enter a value of 50 or less.",
                rowMinLessThanMax: "Maximum row must be greater than or equal to minimum row. Please adjust your values."
            }
        },

        // Shows errors below the corresponding input
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },

        // it creates a new table tab when the form is submitted
        submitHandler: function () {
            generateTable();
            addTableTab();
        }

       
    });


    // Builds the multiplication table
    function generateTable() {
        
        var minCol = parseInt($("#Mincolumn").val(), 10);
        var maxCol = parseInt($("#Maxcolumn").val(), 10);
        var minRow = parseInt($("#Minrow").val(), 10);
        var maxRow = parseInt($("#Maxrow").val(), 10);
        
        
        var table = "<table>";
        var col, col2;
        var row;
        
        

        // table header
        table += "<tr>"
        table += "<th></th>";
        for (col = minCol; col <= maxCol; col++) {
            table += "<th>" + col + "</th>";
        }
        table += "</tr>";

        //  table filling
        for (row = minRow; row <= maxRow; row++) {
            table += "<tr><th>" + row + "</th>";
            for (col2 = minCol; col2 <= maxCol; col2++) {
                table += "<td>" + (row * col2) + "</td>";
             }
             table += "</tr>";
        }
            
        table += "</table>";

            
        $("#tableContainer").html(table); // Displays the table
            
    }

    // Saves the current table in a new tab
    function addTableTab() {

        tabCount++;

        var minCol = parseInt($("#Mincolumn").val(), 10);
        var maxCol = parseInt($("#Maxcolumn").val(), 10);
        var minRow = parseInt($("#Minrow").val(), 10);
        var maxRow = parseInt($("#Maxrow").val(), 10);


        var panelId = "tab-" + tabCount;  // Creates a unique ID for the tab

        // Shows the selected ranges in the tab title
        var label = "Col " + minCol + "→" + maxCol +
                    " | Row " + minRow + "→" + maxRow;

        // Adds a new tab with a close button
        $("#myTabs ul").append(
            "<li id='li-" + panelId + "'>" +
                "<a href='#" + panelId + "'>" + label + "</a>" +
                " <span class='tab-close' data-panel='" + panelId + "' title='Close this tab'>×</span>" +
            "</li>"
        );

        var tableHTML = buildTableHTML(minCol, maxCol, minRow, maxRow); // Adds the table content

        $("#myTabs").append(
            "<div id='" + panelId + "'>" + tableHTML + "</div>"
        );

        // Refreshes tabs and switch to the new one
        $("#myTabs").tabs("refresh");

        var newIndex = $("#myTabs ul li").length - 1;
        $("#myTabs").tabs("option", "active", newIndex);
    }

    // Return a table as an string
    function buildTableHTML(minCol, maxCol, minRow, maxRow) {

        var table = "<table>";

        table += "<tr><th></th>";

        for (var col = minCol; col <= maxCol; col++) {
            table += "<th>" + col + "</th>";
        }

        table += "</tr>";

        for (var row = minRow; row <= maxRow; row++) {

            table += "<tr><th>" + row + "</th>";

            for (var col2 = minCol; col2 <= maxCol; col2++) {
                table += "<td>" + (row * col2) + "</td>";
            }

            table += "</tr>";
        }

        table += "</table>";

        return table;
    }
    // Removes a tab when  button X is clicked
    $(document).on("click", ".tab-close", function () {

        var panelId = $(this).data("panel");

        // Removes the tab and its content
        $("#li-" + panelId).remove();
        $("#" + panelId).remove();

        // Refreshes tabs and return to the form tab
        $("#myTabs").tabs("refresh");
        $("#myTabs").tabs("option", "active", 0);
    });

    // Removes all generated table tabs
    $("#clearTabs").on("click", function () {

        // Keep only the original form tab
        $("#myTabs ul li:not(:first-child)").remove();

        // Delete all generated table content
        $("#myTabs > div[id^='tab-']").remove();

        // Refresh tabs and return to the form
        $("#myTabs").tabs("refresh");
        $("#myTabs").tabs("option", "active", 0);

        // Reset the tab counter
        tabCount = 0;
    });



});