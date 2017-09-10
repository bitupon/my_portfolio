window.Kiiro = window.Kiiro || {};
window.Kiiro.BOD = window.Kiiro.BOD || {};

Kiiro.BOD.JSOMUtil = (function () {
    var _arrayBufferToBase64 = function (buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    var _getListItemById = function (listName, id, success, failure) {
        SP.SOD.executeFunc("SP.js", "SP.ClientContext", function () {
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle(listName);
            var item = list.getItemById(id);

            context.load(item);
            context.executeQueryAsync(
                Function.createDelegate(this, function () {
                    success(item);
                }),
                Function.createDelegate(this, function (sender, args) {
                    failure(sender, args);
                })
            );
        });
    };

    var _getListItem = function (listName, viewXml, success, failure, successParam) {
        SP.SOD.executeFunc("SP.js", "SP.ClientContext", function () {
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle(listName);
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(viewXml);
            var listColl = list.getItems(camlQuery);

            context.load(listColl);
            context.executeQueryAsync(
                Function.createDelegate(this, function () {
                    success(listColl, successParam);
                }),
                Function.createDelegate(this, function (sender, args) {
                    failure(sender, args);
                })
            );
        });
    };

    var _getChoices = function (listName, fieldName, success, failure) {
        SP.SOD.executeFunc("SP.js", "SP.ClientContext", function () {
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle(listName);
            var field = context.castTo(list.get_fields().getByInternalNameOrTitle(fieldName), SP.FieldChoice);

            context.load(field);
            context.executeQueryAsync(
                Function.createDelegate(this, function () {
                    success(field);
                }),
                Function.createDelegate(this, function (sender, args) {
                    failure(sender, args);
                })
            );
        });
    }

    var _getListAttachment = function (listItem, success, failure) {
        var context = listItem.get_context();
        var attachmentFolderUrl = String.format('{0}/Attachments/{1}', listItem.get_fieldValues()['FileDirRef'], listItem.get_fieldValues()['ID']);
        var folder = context.get_web().getFolderByServerRelativeUrl(attachmentFolderUrl);
        var files = folder.get_files();
        context.load(files);
        context.executeQueryAsync(
                Function.createDelegate(this, function () {
                    var attachments = [];
                    var fileCount = files.get_count();
                    for (var i = 0; i < fileCount; i++) {
                        var file = files.get_item(i);
                        attachments.push({ url: file.get_serverRelativeUrl(), name: file.get_name() });
                    }
                    success(attachments);
                }),
                Function.createDelegate(this, function (sender, args) {
                    if (args.get_errorTypeName() == "System.IO.FileNotFoundException") {
                        var attachments = [];
                        success(attachments);
                    }
                    else {
                        failure(sender, args);
                    }
                })
            );
    }

    var _updateListItem = function (listItem, success, failure, param) {
        SP.SOD.executeFunc("SP.js", "SP.ClientContext", function () {
            var context = new SP.ClientContext.get_current();
            listItem.update();
            context.executeQueryAsync(
                Function.createDelegate(this, function () {
                    success(listItem, param);
                }),
                Function.createDelegate(this, function (sender, args) {
                    failure(sender, args);
                })
            );
        });
    };

    var _updateListItemById = function (listName, listItemId, listItemArr, success, failure) {
        SP.SOD.executeFunc("SP.js", "SP.ClientContext", function () {
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle(listName);
            var listItem = list.getItemById(listItemId);
            for (var i = 0; i < listItemArr.length; i++) {
                listItem.set_item(listItemArr[i].Key, listItemArr[i].Value);
            }
            listItem.update();
            context.executeQueryAsync(
                Function.createDelegate(this, function () {
                    success(listItem);
                }),
                Function.createDelegate(this, function (sender, args) {
                    failure(sender, args);
                })
            );
        });
    };

    var _deleteListItem = function (listItem, success, failure, param) {
        SP.SOD.executeFunc("SP.js", "SP.ClientContext", function () {
            var context = new SP.ClientContext.get_current();
            listItem.deleteObject();
            context.executeQueryAsync(
                Function.createDelegate(this, function () {
                    success(param);
                }),
                Function.createDelegate(this, function (sender, args) {
                    failure(sender, args);
                })
            );
        });
    };

    var _addListItem = function (listName, listItemArr, success, failure, successParam) {
        SP.SOD.executeFunc("SP.js", "SP.ClientContext", function () {
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle(listName);
            var itemCreateInfo = new SP.ListItemCreationInformation();
            var listItem = list.addItem(itemCreateInfo);

            for (var i = 0; i < listItemArr.length; i++) {
                listItem.set_item(listItemArr[i].Key, listItemArr[i].Value);
            }
            listItem.update();
            context.load(listItem);
            context.executeQueryAsync(
                Function.createDelegate(this, function () {
                    success(listItem, successParam);
                }),
                Function.createDelegate(this, function (sender, args) {
                    failure(sender, args);
                })
            );
        });
    };

    var _getContentType = function (listName, success, failure) {
        SP.SOD.executeFunc("SP.js", "SP.ClientContext", function () {
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle(listName);
            var contentTypeColl = list.get_contentTypes();

            context.load(contentTypeColl);
            context.executeQueryAsync(
                Function.createDelegate(this, function () {
                    success(contentTypeColl);
                }),
                Function.createDelegate(this, function (sender, args) {
                    failure(sender, args);
                })
            );
        });
    };

    var _addFile = function (listName, content, title, extension, relativeUrl, success, failure, successParam) {

        var getFileBuffer = function (content) {

            var deferred = $.Deferred();
            var reader = new FileReader();

            reader.onload = function (e) {
                deferred.resolve(e.target.result);
            }

            reader.onerror = function (e) {
                deferred.reject(e.target.error);
            }

            reader.readAsArrayBuffer(content);

            return deferred.promise();
        };

        getFileBuffer(content).then(function (buffer) {
            _addFileStream(buffer);
        });

        var _addFileStream = function (buffer) {
            SP.SOD.executeFunc("SP.js", "SP.ClientContext", function () {
                var context = new SP.ClientContext.get_current();
                var web = context.get_web();
                var files = web.getFolderByServerRelativeUrl(relativeUrl + "/" + listName + "/").get_files();
                context.load(files);
                var createInfo = new SP.FileCreationInformation();
                // Convert ArrayBuffer to Base64 string
                createInfo.set_content(_arrayBufferToBase64(buffer));
                // Overwrite if already exists
                createInfo.set_overwrite(true);
                // set target url
                var destUrlName = title + "_" + new Date().getTime() + extension;
                var destUrlString = relativeUrl + "/" + listName + "/" + destUrlName;
                createInfo.set_url(destUrlString);
                // add the new file
                files.add(createInfo);
                // upload file
                context.executeQueryAsync(
                    Function.createDelegate(this, function () {
                        success(destUrlName, successParam);
                    }),
                    Function.createDelegate(this, function (sender, args) {
                        failure(sender, args);
                    })
                );
            });
        }
    }

    return {
        getListItemById: _getListItemById,
        getListItem: _getListItem,
        getListAttachment: _getListAttachment,
        updateListItem: _updateListItem,
        updateListItemById: _updateListItemById,
        deleteListItem: _deleteListItem,
        getContentType: _getContentType,
        addFile: _addFile,
        addListItem: _addListItem,
        getChoices: _getChoices
    };
})();