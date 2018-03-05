const fs = require('fs');
const path = require('path');
const menu = require('./menu');
const YAML = require('json2yaml');

const _ = require('lodash');
const templateFileName = 'messenger.config.template.yml';
const botpressMessengerConfigName = 'botpress-messenger.config.yml';

const config = require('./config');
const messages = require('./messages');

// Creates botpress-messenger.config.yml
module.exports = function setup() {
    const templateFileContents = fs.readFileSync(path.join(__dirname, templateFileName));
    const ymlTemplate = _.template(templateFileContents);
    const ymlText = YAML.stringify(menu).replace('---\n', '');
    const str = ymlTemplate(Object.assign({}, config, {
        greetingMessage: messages.greeting,
        menu: ymlText
    }))
    fs.writeFileSync(path.join(__dirname, '..', botpressMessengerConfigName), str);
}
