const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        applicationId: "215911582291505",
        appSecret: "5013ac8c08469f9080d1b6ee74790218",
        accessToken: "EAADEXtUqVjEBADlJ8xlEqAt222t3IWwOWQU8JFp9biKuXhLYfdpeHJ9EgudlkQxKS8Yu8njhkCqCvvTJg7EHnoEyzj6DsSPDa0ZA6NtD4URzpgcCs7TZBdUDKyfPCZBYH3BolD6Dkso81JMmUVchZChim6BPVAV2cDWuSZAdslgZDZD",
        verifyToken: "cmp-bots",
        chatExtensionHomeUrl: "https://andybot.org",
        hostname: "bots.pagekite.me/",
        staticUrl: "https://static.andybot.org/static/",
        apiEndpoint: "http://localhost:3001",
        trustedDomain: "https://andybot.org"
    },
    production: {        
        applicationId: "215911582291505",
        appSecret: "5013ac8c08469f9080d1b6ee74790218",
        accessToken: "EAADEXtUqVjEBADlJ8xlEqAt222t3IWwOWQU8JFp9biKuXhLYfdpeHJ9EgudlkQxKS8Yu8njhkCqCvvTJg7EHnoEyzj6DsSPDa0ZA6NtD4URzpgcCs7TZBdUDKyfPCZBYH3BolD6Dkso81JMmUVchZChim6BPVAV2cDWuSZAdslgZDZD",
        verifyToken: "cmp-bots",
        chatExtensionHomeUrl: "https://andybot.org",
        hostname: "http://ec2-18-222-67-64.us-east-2.compute.amazonaws.com/",
        staticUrl: "https://static.andybot.org/static/",
        apiEndpoint: "http://localhost:3001",
        trustedDomain: "https://andybot.org"
    }
}

module.exports = config[env];