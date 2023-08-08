const {
    google
} = require('googleapis');

async function getUserEmailType(auth) {
    try {
        const service = google.people({
            version: 'v1',
            auth
        });

        const {
            data: person
        } = await service.people.get({
            resourceName: 'people/me',
            personFields: 'emailAddresses'
        });

        const email = person.emailAddresses[0].value;
        return email.endsWith('gmail.com') ? 'Gmail' : 'Google-Workspace';
    } catch (error) {
        console.error('Error getting user profile:', error.message);
        throw error;
    }
}

/**
 * Lists the first 10 users in the domain.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function importBusinessUserContacts(auth) {
    const service = google.admin({
        version: 'directory_v1',
        auth,

    });
    const res = await service.users.list({
        customer: 'my_customer',
        maxResults: 10,
        orderBy: 'email',
    });

    const users = res.data.users;
    if (!users || users.length === 0) {
        console.log('No users found.');
        return;
    }

    console.log('Users:');
    users.forEach((user) => {
        console.log(`${user.primaryEmail} (${user.name.fullName})`);
    })
    return users;
}

/**
 * Print the display name if available for 10 connections.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listConnectionNames(auth) {
    const service = google.people({
        version: 'v1',
        auth
    });
    const res = await service.people.listDirectoryPeople({
        pageSize: 100,
        readMask: 'names,emailAddresses',
        sources: ['DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE']
    });
    const people = res.data.people;
    if (!people || people.length === 0) {
        console.log('No connections found.');
        return;
    }
    console.log('Connections:');
    return ;
}

async function importContacts(auth) {
    // get user email type
    // if Gmail hosting -> use people api
    // if Google-Workspace -> use directory api admin sdk?
    console.log(`getting email type`)
    const emailType = await getUserEmailType(auth)
    console.log(`emailType is ${emailType}`)
    switch (emailType) {
        case 'Google-Workspace':
            return await listConnectionNames(auth);
        case 'Gmail':
            return await listConnectionNames(auth)
    }
}

module.exports = {
    importContacts,
}