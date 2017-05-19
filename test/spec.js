"use strict";
const HtmlWebpackDisplayLoaderPlugin = require("../");
const assert = require("assert");
const webpack = require("webpack");
const fs = require("fs");
const {JSDOM} = require("jsdom");

describe("Testing HTML Webpack Display Loader Plugin...", function() {
    it("Can create instance without options", function() {
        const testInstance = new HtmlWebpackDisplayLoaderPlugin();
        assert(testInstance instanceof HtmlWebpackDisplayLoaderPlugin);
    });
    it("Can create instance with options", function() {
        const testInstance = new HtmlWebpackDisplayLoaderPlugin({class: "wrapper-class"});
        assert(testInstance instanceof HtmlWebpackDisplayLoaderPlugin);
    });
    describe("Can compile with webpack", function() {
        function bundle(options, assertion, done) {
            let webpackOptions = require("./test_webpack.config")();
            if (options) {
                webpackOptions.plugins.push(new HtmlWebpackDisplayLoaderPlugin(options));
            } else {
                webpackOptions.plugins.push(new HtmlWebpackDisplayLoaderPlugin());
            }
            webpack(webpackOptions, function(err, stats) {
                if (err) {
                    throw err;
                } else if (stats.hasErrors()) {
                    throw stats.toString();
                }
                fs.readFile(__dirname + "/temp/test_index.html", "utf8", (err, text) => {
                    if (err) {
                        throw err;
                    }
                    const {window} = new JSDOM(text);
                    assertion(window);
                    fs.unlinkSync(__dirname + "/temp/test_index.html");
                    fs.unlinkSync(__dirname + "/temp/test_bundle.js");
                    fs.rmdir(__dirname + "/temp", done);
                });
            });
        }
        it("compile without options", function(done) {
            bundle(null, window => {
                const root = window.document.querySelector("body").firstElementChild;
                assert.equal(root.tagName, "DIV");
                assert.equal(root.className, "");
                assert.equal(root.id, "");
                assert.equal(window.getComputedStyle(root, "").position, "fixed");
                assert.equal(window.getComputedStyle(root, "").top, "0px");
                assert.equal(window.getComputedStyle(root, "").bottom, "0px");
                assert.equal(window.getComputedStyle(root, "").left, "0px");
                assert.equal(window.getComputedStyle(root, "").right, "0px");
            }, done);
        });
        it("compile with class options", function(done) {
            bundle({class: "test-class"}, window => {
                const root = window.document.querySelector("body").firstElementChild;
                assert.equal(root.tagName, "DIV");
                assert.equal(root.className, "test-class");
                assert.equal(root.id, "");
                assert.equal(window.getComputedStyle(root, "").position, "fixed");
                assert.equal(window.getComputedStyle(root, "").top, "0px");
                assert.equal(window.getComputedStyle(root, "").bottom, "0px");
                assert.equal(window.getComputedStyle(root, "").left, "0px");
                assert.equal(window.getComputedStyle(root, "").right, "0px");
            }, done);
        });
        it("compile with id options", function(done) {
            bundle({id: "test-id"}, window => {
                const root = window.document.querySelector("body").firstElementChild;
                assert.equal(root.tagName, "DIV");
                assert.equal(root.className, "");
                assert.equal(root.id, "test-id");
                assert.equal(window.getComputedStyle(root, "").position, "fixed");
                assert.equal(window.getComputedStyle(root, "").top, "0px");
                assert.equal(window.getComputedStyle(root, "").bottom, "0px");
                assert.equal(window.getComputedStyle(root, "").left, "0px");
                assert.equal(window.getComputedStyle(root, "").right, "0px");
            }, done);
        });
    });
});