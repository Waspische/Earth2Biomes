// IMPORTANT:
// * The script assumes your property list won't change while it is loaded
// If you buy/sell lands with droids you will need to reload the page :shrug:
// If you keep [SkipDepowereds] as true it will also assume you don't depower/power other droids

// NOTES:
// * You can change the button position (see buttonStyle below), e.g. for bottom left replace "top" with "bottom"
// or for bottom right use "bottom" and "right" instead of left. The amounts (100px, 30px) can be changed too ;)
// * while the raiding is in progress you are safe to dispense those droids that are above the limit set below [DispenseMin]
// (probably already returned from raiding)
// * A "cycle" consists:
//  1) charging droids
//  2) while they charge -> process notifications
//  3) dispense
//  4) raid with remaining
// * Other configs are those you probably already saw, any questions -> ask :)

"use strict"

let config = Object.freeze({
    ui: {
        buttonStyle: `position:fixed;top:100px;left:30px;`,
        autoClick: 6.7, //tries to run cycle every [autoClick] minutes -> set 0 to disable
    },

    notifications: {
        logLastDaysCount: 7, //will log raid data for last "n" days (default: 7)
        markUnreadRaidNotifications: true, //set unread raiding notifications to "read" -> you can delete read notifications :)
        markAllUnreadNotifications: false, //set ALL unread notifications to "read" (NOT JUST raid related)
        deleteReadNotifications: false, //when set to true it will delete all read notifications
        showLoggedDaysCount: false, //when set to true logs how many days are logged
        removeFromFavoritesIfLastNRaidFails: 3, // if the last "n" raids for a given property fails and it is in your favorites -> remove from there
        removeFromFavoritesIfWinLoseRatioBelow: 0.5, //if w/l ratio is below the number -> remove from favorites (1 means 1 win 1 lose, or 10win 10 lose etc)
        minRaidCountForWLRatio: 5,
        raidNotificationTypes: {
            raid_won: "DROID_RAID_SUCCESSFUL",
            raid_fail: "DROID_RAID_FAILED",
        },
        symbols: {
            raid_won: "W",
            raid_fail: "F",
        }
    },

    raiding: {
        propertyOrdering: "tethered", //change to "tethered" to get the properties with most CDs first
        droidsRaidLimits: [
            { tileCount: 700, maxDroids: 3 }, //over [tileCount] tiles -> raid with [maxDroids] droids
            { tileCount: 400, maxDroids: 3 },
            { tileCount: 200, maxDroids: 2 },
            { tileCount: 100, maxDroids: 2 },
            { tileCount: 50, maxDroids: 1 },
            { tileCount: 1, maxDroids: 1 }
        ],
        skipIfLastRaidBelow: 0.5, //skip target if the last raid resulted in less than [skipIfLastRaidBelow] e-ther
        allowLastRaidBelowRecheckAfter: 1.5, //if target was skipped due the last result below [skipIfLastRaidBelow] -> allow recheck after [allowRecheckAfter] hours
        allowLastRaidFailedRecheckAfter: 3, //if target's last raid failed, recheck after the set amount of hours

        allowRecheckForAnyWinsWithDroids: false, //if there is a property with any wins in the last 24hrs -> use that too as a target

        waitTimes: {
            normal: { min: 5000, max: 9900 },
            small: { min: 3500, max: 5000 },
            extra: { afterEvery: 10, wait: 60000, propertyCountMin: 300 },
            //if the current acc has at least [propertyCountMin] raid bases (property with powered droid) waiting to raid (with available droid(s))
            //-> after the [afterEvery]th property wait [wait] millisec
            //default: if you have 200 available properties or more, after every 50th wait an extra 2 minutes (120s -> 120000ms)
        },

        doRaid: true, //when set to false, only the calculations are displayed, no actual raiding happens
        ignoreAlreadyRaidedWarning: false, //when set to true and a property is already raided, but marked as a target -> send droids from the current property too
        ignoreAlreadyTargetedWarning: false, //when set to true and a property is already targeted by this script, but marked as a target -> send droids from the current property too
        logSkipWarning: false, //used for debugging -> more log messages when skipping a property

        logOnlyFavoriteUsed: true, //show message if property only has one favorite
        logRaidSetup: true, //when set to true -> logs what property is raided with droid(s)
        logRemainingFavorites: true, //when there are droids remaining -> log their state for debugging
        logFavoritesAfterRaidSetup: true, //used for debugging

        useClosestInCurrentBracket: true, //when set to true -> use "brackets" (e.g all 750s, 600-749, 500-600 etc) and order by distance first
        skipPropertyWithActiveCiv: false, //when set to true -> skips charging/dispensing raiding property with active civilian
    },

    charge: {
        ChargeBelow: 90, //charge droids below [ChargeBelow]%
        ChargeWaitMin: 3000, //wait between [ChargeWaitMin] and [ChargeWaitMax] ms before doing the next batch
        ChargeWaitMax: 7000,
        ShowCharges: false, //when set to true -> show charges of droids with their names
        BatchSize: 50,
    },

    dispense: {
        DispenseMin: 0.3,
    },

    general: {
        ShowQueryMessages: false, //when set to false -> query messages when refreshing property/droid list are not shown (: query details (droids)...)
        SkipDepowereds: true, //store depowered droids -> skip them when refreshing droid list
        DispenseAfterCycle: true, //when set to true -> after cycle refreshes droid list and dispenses
        DispenseAfterCycleWait: 240, //in seconds e.g. 120 -> 2 minutes
        UseCachedProperties: true, //When set to true uses indexeddb to store properties, if there's a difference between the stored and actual land count it will throw an error
        ClaimEtherOnEachCycle: true, //at the beginning of each raid cycle the available ether is claimed
    }
});

let hourMultiplier = 1000 * 60 * 60;

let loadScript = async (src) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.onload = resolve;
        script.onerror = reject;
        script.src = src;
        document.head.append(script);
    })
};
//await loadScript('https://npmcdn.com/dexie/dist/dexie.js');
//await loadScript("https://npmcdn.com/dexie/dist/dexie.min.js")

await loadScript("https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js")
console.log("dexie loaded");

let TargetState = Object.freeze({
    AlreadyBeingRaided: "ALREADY-RAIDING",
    NoWinsAtAll: "NO-WINS",
    HadWinsButLastRaidFailed: "LAST-FAILED",
    LastRaidBelowLimit: "LAST-LOW-ETHER",
    LastRaidForFull: "LAST-LOW-ETHER-3",
    //HasDroids: "HAS-DROIDS",
    Keep: "KEEP",


    RecheckLastFailed: "[RE]:LAST-FAILED",
    RecheckLastBelow: "[RE]:LAST-BELOW",
    RecheckAnyWinsWithoutDroids: "[RE]:ANY-NO-DROIDS",
    RecheckAnyWinsWithDroids: "[RE]:ANY-WITH-DROIDS"
});

eval(await fetch("https://raw.githubusercontent.com/mihaj-scripts/e2-scripts2/main/_other/get_helper.js").then(t => t.text()));

class Logger {

    constructor() {
        this.padStartAmount = 3;
        this.symbol_no_targets = '😱';
        this.symbol_property = "⭐";
        this.symbol_already_raided = '⭕';
        this.symbol_has_droids = '😈';
        this.symbol_over_raided = '🏮'
        this.symbol_non_favorite = '👻';
        this.symbol_only_favorite = '☝';
        this.symbol_remaining_droid = '🍋';
        this.symbol_raid_launch = '🌌';
        this.symbol_recheck_overraided = '🔓';

        this.padString = " ".repeat(this.padStartAmount);
    }

    log (doPadStart, message, formatting) {
        let toLog = doPadStart ? this.padString + message : message;
        if (formatting) {
            console.log(toLog, ...formatting);
        } else {
            console.log(toLog);
        }
    }

    logNoTargets (landfield, target) {
        let landfieldDisplay = `${landfield.attributes.description} (${landfield.attributes.location})`
        this.log(true, `${this.symbol_no_targets} - no targets for : ${landfieldDisplay}`);
        // if (target) {
        //     this.log(true, `only target state: ${target.targetState} (results: ${target.raidResults.join(" | ")})`)
        // }
    }

    logPropertyProcessing (landfield, allProperties, index) {
        let indexDisplay = `${index + 1}/${allProperties.length}`;
        let droidDisplay = `${landfield.availableDroids.length} (total: ${landfield.droids.length})`;
        let landfieldDisplay = `${landfield.attributes.description} %c(${landfield.attributes.location})`
        this.log(
            false,
            `${this.symbol_property} Processing [${indexDisplay}] - CDs: [${droidDisplay}] - %c${landfieldDisplay}`,
            ['color:deepskyblue; border-bottom: 1px dashed gold;', 'border:none']);
    }

    logAlreadyBeingRaided (target) {
        if (config.raiding.logSkipWarning) {
            let t = target.attributes;
            let targetDisplay = `%cT${t.tileCount} %c- ${t.description} (${t.location}) (%c${t.owner.attributes.username}%c)`;
            let targetFormat = ["color:gold", "color:snow", "color:lime", "color:snow"];
            this.log(true, `${this.symbol_already_raided} Already being raided: ${targetDisplay} `, targetFormat);
        }
    }

    logOverRaided (target, raidedLast24Hours, result, reason) {
        let display = this.getTargetDisplay(target);

        let resDisplay = `${result ? "SKIP" : "KEEP"} (results: ${target.raidResults.join(" | ")})`;

        this.log(true, `${this.symbol_over_raided} ${reason} ${resDisplay} - ${display.targetDisplay}`, display.targetFormat);
    }

    logOverRaidRecheck (target) {
        let display = this.getTargetDisplay(target);

        let symbol = '✅';
        switch (target.targetState) {
            case TargetState.LastRaidBelowLimit:
                symbol = '🚧'
                break;
            case TargetState.HadWinsButLastRaidFailed:
                symbol = '⚡';
                break;
            default:
                if (target.hasDroids) {
                    symbol = '👀';
                }
                break;
        }
        this.log(true, `${this.symbol_recheck_overraided} retry (${symbol} ${target.targetState} | results: ${target.raidResults.join(" | ")}) \r\n${this.padString}${display.targetDisplay}`, display.targetFormat);
    }

    logUsingFirstNonFavorite (target) {
        let display = this.getTargetDisplay(target);
        this.log(true, `${this.symbol_non_favorite} Using first non-favorite: ${display.targetDisplay} `, display.targetFormat);
    }

    logUsingOnlyFavorite (target) {
        let display = this.getTargetDisplay(target);
        this.log(true, `${this.symbol_only_favorite} Using only favorite: ${display.targetDisplay} `, display.targetFormat);
    }

    logFavorites (msg, favorites) {
        console.groupCollapsed(msg)
        for (let i = 0; i < favorites.length; i++) {
            let target = favorites[i];
            if (target.targetState)
                try {
                    let display = this.getTargetDisplay(target);
                    this.log(true, `(${target.targetState} >> ${target.raidResults.join(" | ")}) ${display.targetDisplay}`, display.targetFormat);
                } catch (e) {
                    console.log("error caught - lRD", target)
                }
        }
        console.groupEnd();
    }

    logRemainingDroids (landfield, favorites) {

        let msg = `${this.symbol_remaining_droid} remaining droids: ${landfield.availableDroids.length}`
        if (!config.raiding.logRemainingFavorites) {
            this.log(true, msg);
        }
        else {
            this.logFavorites(msg, favorites);
        }
    }

    logRaidLaunch (raidSetup, waitTimes, favorites) {
        try {
            if (config.raiding.logRaidSetup) {
                let target = raidSetup.targetLandfield;
                let t = target.attributes;
                let targetDisplay = ` %cdistance: %c${target.meta.distanceKm}%ckm | CD: ${raidSetup.usedDroids.length} | %cT${t.tileCount} %c | ${t.description} (${t.location}) (%c${t.owner.attributes.username}%c)`;
                let targetFormat = ["color:snow", "color:magenta", "color:snow", "color:gold", "color:snow", "color:lime", "color:snow"];

                let resultsDisplay = target.raidResults.length > 0 ? raidSetup.targetLandfield.raidResults.join(" | ") : "-";
                let message = `${this.symbol_raid_launch} (${target.targetState} ${resultsDisplay}) ${targetDisplay}`;
                this.log(true, message, targetFormat);
                //console.log("   setup: ", raidSetup);
                if (favorites && config.raiding.logFavoritesAfterRaidSetup) {
                    this.logFavorites(`favorites (${favorites.length}): `, favorites);
                }

            }
        } catch (e) {
            console.log("exception - LRL", raidSetup);
            throw e;
        }

    }

    getTargetDisplay (target) {
        let t = target.attributes;
        let targetDisplay = `D:${target.meta.distanceKm}km %cT${t.tileCount} %c- ${t.description} (${t.location}) (%c${t.owner.attributes.username}%c)`;
        let targetFormat = ["color:gold", "color:snow", "color:lime", "color:snow"];
        return { targetDisplay, targetFormat };
    }
}

let logger = new Logger();

class RaidNotificationCache {
    constructor() {
        this.db = new Dexie("RaidNotifications");
        this.db.version(2).stores({
            RaidNotifications: "id"
            , PropertiesRemovedFromFavorites: "id"
        }); //id: property id
    }

    async init () {
        await this.db.open();
    }

    async add (notification) {
        await this.db.RaidNotifications.add({ id: notification.id, notification });
    }

    async bulkAdd (notifications) {
        await this.db.RaidNotifications.bulkAdd(notifications);
    }

    async get (propertyId) {
        return await this.db.RaidNotifications.get(propertyId);
    }

    async put (notification) {
        return await this.db.RaidNotifications.put(notification);
    }

    async getAll () {
        let raidNotifications = await this.db.RaidNotifications.toArray();
        return raidNotifications;
    }

    async getAllRemoved () {
        let removedProperties = await this.db.PropertiesRemovedFromFavorites.toArray();
        return removedProperties;
    }

    async addRemoved (removedProperty) {
        await this.db.PropertiesRemovedFromFavorites.add(removedProperty);
    }
}

class AutoRaidDataCache {
    constructor() {
        this.db = new Dexie("AutoRaidDataCache");
        this.db.version(3).stores({
            DroidLandfields: "id",
            DepoweredDroids: "id",
            UserDetails: "id",
        }); //id: property id
    }

    async init () {
        await this.db.open();
    }

    async add (property) {
        await this.db.DroidLandfields.add(property);
    }

    async bulkAdd (properties) {
        await this.db.DroidLandfields.bulkAdd(properties);
    }

    async get (propertyId) {
        return await this.db.DroidLandfields.get(propertyId);
    }


    async getAll () {
        let allItems = await this.db.DroidLandfields.toArray();
        return allItems;
    }

    async getAllDepoweredDroids () {
        let allItems = await this.db.DepoweredDroids.toArray();
        return allItems;
    }

    async bulkAddDepoweredDroids (droids) {
        await this.db.DepoweredDroids.bulkAdd(droids);
    }

    async getAllUserDetails () {
        let allItems = await this.db.UserDetails.toArray();
        return allItems;
    }

    async bulkAddUserDetails (userDetails) {
        await this.db.UserDetails.bulkAdd(userDetails);
    }
}

class E2API {
    constructor() {
        this.initReact();
        this.propertyCache = new AutoRaidDataCache();
    }

    initReact () {
        window.___reactContext = Array.from(document.querySelectorAll("*"))
            .filter(t => Object.keys(t).some(tk => tk.includes("reactFiber")))
            .map(el => el[Object.keys(el).find(tk => tk.includes("reactFiber"))])
            .find(zu => zu.return?.dependencies?.firstContext?.context)
            .return.dependencies.firstContext.context._currentValue;
        console.log(`%c* Author discord: %c@mihaj`, `color:bada55;`, `color:gold`);
    }

    async getDroidLandfields () {
        const firstPageData = await this.getDroidLandFieldFirstPage();

        if (config.general.UseCachedProperties) {
            await this.propertyCache.init();
            let propertiesCached = await this.getDroidLandfieldsCached();
            //console.log("cached: ", propertiesCached, firstPageData);

            if (propertiesCached.length === firstPageData.count) {
                console.log(`cached properties found: ${propertiesCached.length}`);
                return propertiesCached;
            } else {
                console.log(`cached [${propertiesCached.length}] vs server [${firstPageData.count}]\r\n--> getting data from server`);

                let properties = await this.getDroidLandfieldsFromServer(firstPageData);
                properties = properties.filter(p => !propertiesCached.find(pp => pp.id === p.id));
                console.log(`adding ${properties.length} new properties`);
                this.propertyCache.bulkAdd(properties);
                return await this.getDroidLandfieldsCached();
            }
        }

        return await this.getDroidLandfieldsFromServer(firstPageData);
    }

    async getDroidLandfieldsCached () {
        let result = (await this.propertyCache.getAll()).filter(p => p.attributes.ownerId === auth0user.id);
        return result;
    }

    async getDroidLandfieldsFromServer (firstPageData) {
        let droidLandfields = firstPageData.data;
        let waitTime = firstPageData.pageCount > 200 ? 250 : 100;
        for (let i = 2; i <= firstPageData.pageCount; i++) {
            if (config.general.ShowQueryMessages) {
                console.log(`query page [${i}/${firstPageData.pageCount}]`);
            }
            const landFields = await this.getDroidLandFieldPage(i);
            droidLandfields = droidLandfields.concat(landFields);

            await helper.sleep(helper.getWaitTime(i, waitTime));
        }

        console.log("getting droid landfields finished");
        return droidLandfields;
    }

    async getDroidLandFieldFirstPage () {
        let query = await ___reactContext.api.apiClient.get(`/droids/landfields?page=1&q=&sortBy=${config.raiding.propertyOrdering}&sortDir=desc`);
        return {
            data: query.data.data,
            pageCount: query.data.meta.pages,
            count: query.data.meta.count
        };
    }

    async getDroidLandFieldPage (pageNumber) {
        const query = await ___reactContext.api.apiClient.get(`/droids/landfields?page=${pageNumber}&q=&sortBy=${config.raiding.propertyOrdering}&sortDir=desc`);
        return query.data.data;
    }

    async getDroidsDetails (droidLandfields) {
        let result = [];
        let allDroidIds = droidLandfields.map(dl => dl.meta.droidIds).flat();
        console.log(`total CD count: ${allDroidIds.length}`);
        if (config.general.SkipDepowereds && this.depoweredList) {
            allDroidIds = allDroidIds.filter(d => !this.depoweredList.find(dd => dd.id === d));
            console.log(` without depowereds : ${allDroidIds.length}`)
        }

        let batchSize = 100;

        let counter = 1;
        while (allDroidIds.length > 0) {
            const currentBatch = allDroidIds.splice(0, batchSize);

            if (config.general.ShowQueryMessages) {
                console.log(`query details (droids) [${counter}], ${allDroidIds.length} remains`);
            }

            const droidData = await this.getDroidsData(currentBatch);
            result = result.concat(droidData);

            //break;
            await helper.sleep(helper.getWaitTime(counter, 2500));
            counter++;

            //throw new Error("test");
        }

        if (!this.depoweredList) {
            this.depoweredList = result.filter(d => d.attributes.state === "depowered");
        }

        return result;
    }

    async getDroidsData (droidIds) {
        const droidData = await ___reactContext.droidsRepositoryStore.fetchDroids({ ids: droidIds })
        return droidData.data;
    }

    async getTargetsForLandfield (property, favorites) {
        //console.log(`  getting raid targets for [${property.id}]: `, property);
        //console.log(`  getting favorites for CD home`);

        const firstPageData = await this.getRaidTargetForLandfieldPage(property.id, 1, favorites);
        //console.log("first page: ", firstPageData);
        let targets = firstPageData.data;
        const pageCount = firstPageData.meta.pages;

        for (let i = 2; i <= pageCount; i++) {
            //console.log(`   query page [${i}/${pageCount}]`);
            const landFields = await this.getRaidTargetForLandfieldPage(property.id, i, favorites);

            targets = targets.concat(landFields.data);

            if (pageCount > 50) {
                await helper.sleep(helper.getWaitTime(i, 500));
            }

        }

        await helper.sleep(helper.getRandom(500, 2000));
        //console.log("getting raid target landfields finished");
        return targets;
    }

    async getRaidTargetForLandfieldPage (propertyId, pageNumber, favorites) {
        let query = await ___reactContext.api.apiClient.get(`/droids/landfields/${propertyId}/raid?favorites=${favorites}&page=${pageNumber}&q=&recents=false&sortBy=tilesCount&sortDir=desc`);
        return query.data;
    }

    async getNotifications () {
        let result = await fetch("/api/v2/my/messages/?items=9999&limit=9999&message_class=NOTIFICATION&offset=0").then(r => r.json())
        return result.results;
    }

    async markAsRead (notificationId) {
        await ___reactContext.api.markAsReadForMyMessage({ id: notificationId, messageClass: "NOTIFICATION" })
    }

    async markAllRead () {
        await ___reactContext.api.markAllAsReadForMyMessages({ messageClass: "NOTIFICATION" })
    }

    async deleteRead () {
        ///api/v2/my/messages/?message_class=NOTIFICATION&read=true
        await ___reactContext.api.deleteReadNotifications({ messageClass: "NOTIFICATION" });
    }

    async getRaidTargetForProperty (property, favorite, stopAtFirstNonFavorite) {
        const firstPageData = await this.getRaidTargetPage(property.id, property.availableDroids.map(d => d.id), favorite, 1);
        //console.log("first page: ", firstPageData);
        let targets = firstPageData.data;
        const pageCount = firstPageData.meta.pages;

        if (!favorite && stopAtFirstNonFavorite && targets.some(t => t.meta.favorite === null)) {
            return targets;
        }

        for (let i = 2; i <= pageCount; i++) {
            //console.log(`   ${helper.getFormattedTime()} : query page [${i}/${pageCount}]`);
            const landFields = await this.getRaidTargetPage(property.id, property.availableDroids.map(d => d.id), favorite, i);
            targets = targets.concat(landFields.data);

            if (!favorite && stopAtFirstNonFavorite && targets.some(t => t.meta.favorite === null)) {
                break;
            }

            await helper.sleep(helper.getWaitTime(i, 1500));
        }

        //console.log("getting raid target landfields finished");
        return targets;
    }

    async getRaidTargetPage (propertyId, droidIds, favorite, pageNumber) {

        let result = await ___reactContext.api.apiClient.get(`/droids/landfields/${propertyId}/raid`, {
            params: {
                autos: false,
                favorites: favorite,
                page: pageNumber,
                q: "",
                recents: false,
                sortBy: "tilesCount",
                sortDir: "desc",
                withinRangeDroidIds: droidIds
            }
        })
        //let result = await ___reactContext.api.apiClient.get(`/droids/landfields/${propertyId}/raid?favorites=${favorite}&page=${pageNumber}&q=&recents=false&sortBy=tilesCount&sortDir=desc`);

        let userIds = [... new Set(result.data.data.map(l => l.attributes.ownerId))];
        let owners = await this.getUsers(userIds);
        result.data.data.forEach(l => {
            l.attributes.owner = owners.find(o => o.id === l.attributes.ownerId);
            l.matchingLimit = config.raiding.droidsRaidLimits.find(limit => limit.tileCount <= l.attributes.tileCount);
        });

        return result.data;
    }

    async getUsers (userIds) {
        let result = await ___reactContext.api.apiClient.get("/users", { params: { ids: userIds } });
        return result.data.data;
    }

    async getCivsData (civIds) {
        const civData = await ___reactContext.civiliansRepositoryStore.fetchCivilians({ ids: civIds });
        return civData.data;
    }

    async raid (landfieldId, droidIds) {
        //PUT /droids/raid
        //autoRaid: false
        await ___reactContext.api.apiClient.put("/droids/raid", {
            autoRaid: false,
            ids: droidIds,
            landfield: landfieldId
        })
    }
}

let api = new E2API();

class NotificationHandler {
    constructor() {
        this.cache = new RaidNotificationCache();
    }

    async syncCache (allNotifications, raidingNotifications) {
        let newNotifications = [];
        for (let i = 0; i < raidingNotifications.length; i++) {
            let notification = raidingNotifications[i]
            if (!allNotifications.find(an => an.id === notification.id)) {
                notification.createdDate = new Date(notification.created);
                notification.userId = auth0user.id;
                newNotifications.push(notification);
            }
        }

        if (newNotifications.length > 0) {
            console.log(`🔄 caching ${newNotifications.length} new  notifications`);
            await this.cache.bulkAdd(newNotifications);
        } else {
            console.log(`%c**  no new notifications  **`, "color:lime");
        }

        return newNotifications;
    }

    async process () {

        performance.mark("notif-start");

        await this.cache.init();
        let allNotifications = (await this.cache.getAll()).filter(n => n.userId === auth0user.id);
        let n = await api.getNotifications();

        let allRemovedProperties = (await this.cache.getAllRemoved()).filter(n => n.userId === auth0user.id);

        let notificationTypes = [
            config.notifications.raidNotificationTypes.raid_won,
            config.notifications.raidNotificationTypes.raid_fail
        ];

        let raidingNotifications = n.filter(n => n.message_category === "RAIDING" && notificationTypes.includes(n.event_type));
        let newNotifications = await this.syncCache(allNotifications, raidingNotifications);

        if (config.notifications.markUnreadRaidNotifications) {
            await this.markUnreadNotifications(raidingNotifications);
        }

        allNotifications = newNotifications.concat(allNotifications).filter(n => notificationTypes.includes(n.event_type));
        window.allNotifications = allNotifications;

        let allDates = [... new Set(allNotifications.map(n => helper.getDateFormatted(n.createdDate)))].sort();
        if (config.notifications.showLoggedDaysCount) {
            console.log(`logged dates count: ${allDates.length} (since: ${allDates[0]})`)
        }

        if (config.notifications.logLastDaysCount > 0) {
            let wonRaids = allNotifications.filter(n => n.event_type === config.notifications.raidNotificationTypes.raid_won);
            let failedRaids = allNotifications.filter(n => n.event_type === config.notifications.raidNotificationTypes.raid_fail);

            this.logLastDays(allDates.slice(-config.notifications.logLastDaysCount), wonRaids, failedRaids);
        }

        let newRNotifications = newNotifications.filter(n => notificationTypes.includes(n.event_type));
        let toRemove = this.processProperties(allNotifications, newNotifications, allRemovedProperties);
        await this.checkRemovalFromFavorites(toRemove);

        if (config.notifications.deleteReadNotifications) {
            console.log(`💠 deleting read notifications`);
            await api.deleteRead();
        }
        console.log(".. notification processing done ..");

        performance.mark("notif-end");
        let measure = performance.measure("notif-start-end", "notif-start", "notif-end");
        let duration = measure.duration;
        let seconds = duration / 1000;
        return seconds;
    }


    processProperties (allNotifications,newNotifications, allRemovedProperties) {
        let symbol_win = config.notifications.symbols.raid_won;
        let symbol_fail = config.notifications.symbols.raid_fail;

        allNotifications.forEach(notif => notif.createdDate_time = notif.createdDate.getTime());

        let allRaidedLandfieldIds = [... new Set(allNotifications.map(n => n.data.enemyLandfield.id))];
        let newRaidedLandfieldIds = [... new Set(newNotifications.map(n => n.data.enemyLandfield.id))];

        let toRemove = [];
        let landFieldDisplayFormats = [
            "color:snow",
            "color:deepskyblue",
            "color:snow",
            "color:lime",
            "color:snow",
            "border-bottom:1px dashed lime",
            "color:snow",
        ];

        let checkLastN = config.notifications.removeFromFavoritesIfLastNRaidFails;
        let ratioLimit = config.notifications.removeFromFavoritesIfWinLoseRatioBelow;
        let raidWon = config.notifications.raidNotificationTypes.raid_won;

        let notRemovedLandfields = allRaidedLandfieldIds.filter(id => !allRemovedProperties.find(p => p.id === id));
        console.log(`.. raided landfields: ${notRemovedLandfields.length}`);
        notRemovedLandfields = newRaidedLandfieldIds.filter(id => !allRemovedProperties.find(p => p.id === id));;
        console.log(`.. raided landfields (new): ${notRemovedLandfields.length}`);

        let allRaidedLandfields = new Array(notRemovedLandfields.length);
        let timeLimit = new Date().getTime() - hourMultiplier * 24 * 5;

        for(let i = 0; i<notRemovedLandfields.length; i++){
            //console.log(`processing ${i}`);
            let m = notRemovedLandfields[i];
            let raidsForLandfield = allNotifications.filter(n => n.data.enemyLandfield.id === m).sort((a, b) => a.id > b.id ? 1 : -1);
            let hasRaidsInLast5Days = raidsForLandfield.some(r => r.createdDate_time > timeLimit)
            if (hasRaidsInLast5Days) {
                //has raid in the last week

                let landfield = raidsForLandfield[0].data.enemyLandfield;
                let victim = raidsForLandfield[0].data.victim;

                let results = new Array(raidsForLandfield.length);
                let earnedTotal = 0.0;
                let winCount = 0;
                let loseCount = 0;
                for(let j = 0; j<raidsForLandfield.length; j++){
                    let raidResult = raidsForLandfield[j];
                    //results[j] = isWon ? symbol_win : symbol_fail;
                    if(raidResult.event_type === raidWon){
                        results[j] = symbol_win;
                        winCount++;
                    } else {
                        results[j] = symbol_fail;
                        loseCount++;
                    }
                    earnedTotal+= raidResult.data.etherAmount;
                }


                landfield.results = results;
                landfield.earnedTotal = earnedTotal;

                allRaidedLandfields[i] = landfield;

                let addedToRemove = false;

                if (checkLastN > 0) {
                    let lastNRaids = results.slice(-checkLastN);
                    if (lastNRaids.length === checkLastN && lastNRaids.every(n => n === symbol_fail)) {
                            console.log(`🔴 last [${checkLastN}] raids failed for ${this.getLandfieldDisplay(landfield, victim)}`, ...landFieldDisplayFormats);
                            toRemove.push(raidsForLandfield[0]);
                            addedToRemove = true;
                    }
                }

                let ratioWinLose = winCount / loseCount;
                
                if (
                    raidsForLandfield.length > config.notifications.minRaidCountForWLRatio
                    && !addedToRemove
                    && ratioWinLose < ratioLimit
                ) {

                    let resultsMsg = `[${results.join(" | ")}]`;
                    let ratioMsg = `🚫 w/l ratio [${ratioWinLose.toFixed(2)}] less than limit [${ratioLimit}] : \r\n`
                    console.log(`${ratioMsg}  ${this.getLandfieldDisplay(landfield, victim)} \r\n  results: ${resultsMsg}`, ...landFieldDisplayFormats);
                    toRemove.push(raidsForLandfield[0]);
                }
            }
        }

        return toRemove;
    }

    getLandfieldDisplay(landfield, victim){
        return `%c[%c${landfield.description}%c](%c${landfield.location}%c) owned by [%c${victim.username}%c]`
    }

    logLastDays (dates, wonRaids, failedRaids) {
        console.log(`performance for last '${dates.length}' logged day(s): `);
        dates.forEach(date => {
            const wonOnDate = wonRaids.filter(n => helper.getDateFormatted(n.createdDate) === date);
            const failedOnDate = failedRaids.filter(n => helper.getDateFormatted(n.createdDate) === date);

            let wonLandfields = wonOnDate.map(n => n.data.enemyLandfield.id);
            let failLandfields = failedOnDate.map(n => n.data.enemyLandfield.id);
            let allLandfields = [... new Set(wonLandfields.concat(failLandfields))];
            let total = wonOnDate.length + failedOnDate.length;

            let winPercentage = (wonOnDate.length / total) * 100;
            let failPercentage = (failedOnDate.length / total) * 100;

            let totalEarned = wonOnDate.map(n => n.data.etherAmount).reduce((a, b) => a + b, 0);
            let earnedMsg = `earned: ${helper.getPadded(totalEarned.toFixed(4), 10)}`

            let totalMsg = `%c'${date}' %c${helper.getPadded(total, 4)} raids %c(%c${helper.getPadded(allLandfields.length, 4)} %clands)`;
            let winMsg = `w:%c${helper.getPadded(wonOnDate.length, 4)} %c${helper.getPadded(winPercentage.toFixed(2), 6)}%`;
            let failMsg = `f: %c${helper.getPadded(failedOnDate.length, 4)} %c${helper.getPadded(failPercentage.toFixed(2), 6)}%`;

            let styling = [
                "color:snow", "color:lime", "color:snow", "color:gold", "color:snow",
                "color:gold", "color:snow",
                "color:red", "color:snow",
            ];

            console.log(`* ${totalMsg} | ${winMsg} | ${failMsg} | ${earnedMsg}`, ...styling);
        });
        console.log("---- ".repeat(4));
    }

    async checkRemovalFromFavorites (toRemove) {
        let landfieldIds = [... new Set(toRemove.map(n => n.data.enemyLandfield.id))];

        if (landfieldIds.length > 0) {
            console.log(`to remove from favorites: ${landfieldIds.length}`);

            let favorites = new Map();

            for (let i = 0; i < landfieldIds.length; i++) {
                let landfieldId = landfieldIds[i]
                //get the first notification where id is the enemy/target landfield id
                //get the source landfield -> add to ownerLandfieldIds
                let relatedNotification = toRemove.find(n => n.data.enemyLandfield.id === landfieldId);
                let enemyLandfield = relatedNotification.data.enemyLandfield;
                enemyLandfield.userId = auth0user.id;

                console.log(`💀 Processing [${enemyLandfield.description}](${enemyLandfield.location}) owned by (${relatedNotification.data.victim.username})`);
                //-> check favorites list
                let homeLandfield = relatedNotification.data.homeLandfield;
                let favoritesForProperty = favorites.has(homeLandfield.id) ? favorites.get(homeLandfield.id) : null;
                if (favoritesForProperty === null) {
                    favoritesForProperty = await api.getTargetsForLandfield(homeLandfield, true);
                    favorites.set(homeLandfield.id, favoritesForProperty);
                }

                if (!favoritesForProperty.find(p => p.id === enemyLandfield.id)) {
                    console.log(`  ⛔ property [${enemyLandfield.description}](${enemyLandfield.location}) is not in favorites`);
                } else {
                    let response = await ___reactContext.api.apiClient.put(`/landfields/${enemyLandfield.id}/toggle_favorite`);
                    while (response.data.favorite !== null) {
                        await helper.sleep(500);
                        response = await ___reactContext.api.apiClient.put(`/landfields/${enemyLandfield.id}/toggle_favorite`);
                    }
                }

                //add to cache
                this.cache.addRemoved(enemyLandfield);
            };
        }
    }

    async markUnreadNotifications (allNotifications) {
        if (!config.notifications.markAllUnreadNotifications) {
            let unreadNotifications = allNotifications.filter(n => n.read_at === null);
            if (unreadNotifications.length > 0) {
                console.log(`🔔 marking [${unreadNotifications.length}] notifications read`);
                for (let i = 0; i < unreadNotifications.length; i++) {
                    await api.markAsRead(unreadNotifications[i].id);
                    await helper.sleep(helper.getWaitTime(i, 250));
                }
                if (unreadNotifications.length > 500) {
                    console.log(`extra wait: 1min`);
                    await helper.sleep(60000);
                }
            }
        } else {
            console.log(`%cmarking %cALL %cunread notifications marked`, "color:snow", "color:red", "color:snow");
            await api.markAllRead();
        }

    }
}

let notificationHandler = new NotificationHandler();

class RaidSetup {
    constructor(sourceLandfield, targetLandfield, droids) {
        this.source = sourceLandfield.id;
        this.landfieldId = targetLandfield.id;
        this.tiles = targetLandfield.attributes.tileCount;
        this.usedDroids = droids;

        this.sourceLandfield = sourceLandfield;
        this.targetLandfield = targetLandfield;
    }
}

class RaidHelper {
    constructor() {
        this.raidHistoryCache = new RaidNotificationCache();

        this.civsCache = new Map();
    }

    async init () {
        if (!this.droidLandfields) {
            console.log("init landfield cache");
            this.droidLandfields = await api.getDroidLandfields();
            window.droidLandfields = this.droidLandfields;
            await this.raidHistoryCache.init();
        }

        await this.refreshDroidsList();
    }

    async refreshDroidsList () {
        console.log("refresh droid state/list");
        this.droidData = await api.getDroidsDetails(this.droidLandfields);
        window.droidData = this.droidData;
        if (window.droidData.length > 2000) {
            console.log(`extra wait: 30s`);
            await helper.sleep(30000);
        }
    }

    async doCycle () {
        this.markCycleStart();

        if (config.general.ClaimEtherOnEachCycle) {
            ___reactContext.api.postClaimEther();
        }

        await this.init();

        let lowestPercentage = await this.chargeDroids();
        let notifProcessTime = await notificationHandler.process();

        let originalWaitTime = 6 * (95 - Math.abs(lowestPercentage));
        let waitTime = originalWaitTime;
        if (waitTime < notifProcessTime) {
            waitTime = 11; //wait at least 11s
        } else {
            waitTime = Math.max(waitTime - notifProcessTime, 10);
        }

        console.log(`lowest charge: ${lowestPercentage.toFixed(2)}% -> original wait: ${originalWaitTime.toFixed(2)}s, notifications: ${notifProcessTime.toFixed(2)}s >> wait ${waitTime.toFixed(2)}s`);

        await helper.sleep(waitTime * 1000);

        await this.dispenseDroids(true);

        await this.raidDroids();

        if (config.general.DispenseAfterCycle) {
            console.log(`checking for dispense again after waiting ${config.general.DispenseAfterCycleWait}s`);
            await helper.sleep(config.general.DispenseAfterCycleWait * 1000);
            await this.refreshDroidsList();
            await this.dispenseDroids(false);
        }

        this.markCycleEnd();
    }

    async shouldSkipDueActiveCiv (landfield) {
        if (config.raiding.skipPropertyWithActiveCiv) {
            if (!this.civsCache.has(landfield.id)) {
                let civData = landfield.meta.civilianIds.length > 0 ? await api.getCivsData(landfield.meta.civilianIds) : [];
                this.civsCache.set(landfield.id, civData);
            }

            return this.civsCache.get(landfield.id).some(civ => civ.attributes.enabled);
        }

        return false;
    }

    async chargeDroids () {
        console.log(`check for droids to charge, batch size: ${config.charge.BatchSize}`);
        //return lowest percentage

        this.droidData.forEach(m => {
            const elapsed = (___reactContext.now - new Date(m.attributes.stateTs).getTime()) / 1e3
            const chargeAndWeightMultiplier = m.attributes.chargeConsumption * m.attributes.weight / 60
            const t = m.attributes.chargeStart - elapsed * chargeAndWeightMultiplier;
            const isMaxChargeZero = m.attributes.maxCharge === 0;
            m.chargeAbs = isMaxChargeZero ? 0 : (Math.min(Math.max(0, t), m.attributes.maxCharge))
            m.currentCharge = isMaxChargeZero ? 0 : Math.round(m.chargeAbs / m.attributes.maxCharge * 100);
            m.landfield = this.droidLandfields.find(lf => lf.id === m.attributes.landfieldId)

        })

        let droidsToCharge = this.droidData.filter(d =>
            d.attributes.state === "idle"
            && d.currentCharge < config.charge.ChargeBelow
        );

        let exclude = [];
        for (let i = 0; i < droidsToCharge.length; i++) {
            let droid = droidsToCharge[i];
            let skipLandfield = await this.shouldSkipDueActiveCiv(droid.landfield);
            if (skipLandfield) {
                exclude.push(droid);
            }
        }
        if (exclude.length > 0) {
            console.log(`skipping charge for [${exclude.length}] droids (active civs)`);
            droidsToCharge = droidsToCharge.filter(d => !exclude.find(de => de.id === d.id));
        }

        let charges = droidsToCharge.filter(d => isFinite(d.currentCharge)).map(m => m.currentCharge);

        if (config.charge.ShowCharges) {
            let chargesWithNames = droidsToCharge
                .filter(d => isFinite(d.currentCharge))
                .sort((a, b) => a.currentCharge < b.currentCharge ? 1 : -1)
                .map(m => `${m.attributes.name}: ${m.currentCharge}%`);
            console.log(`charges: \r\n${chargesWithNames.join(" | ")}`);
        }

        if (droidsToCharge.length > 0) {
            console.log(`droids to charge (below ${config.charge.ChargeBelow}%): [${droidsToCharge.length}]`);

            let counter2 = 1;
            while (droidsToCharge.length > 0) {
                const currentBatch = droidsToCharge.splice(0, config.charge.BatchSize);
                const waitTime = helper.getRandom(config.charge.ChargeWaitMin, config.charge.ChargeWaitMax);
                console.log(`${counter2}) charging [${currentBatch.length}] -> remaining [${droidsToCharge.length}] , waiting ${waitTime}ms`);

                if (currentBatch.length > 0) {
                    try {
                        await ___reactContext.api.apiClient.patch("/droids/charge", { ids: currentBatch.map(d => d.id) })
                    } catch (error) {
                        console.error(`Error charging deez nuts towards your face: ${error}`);
                    }
                    await helper.sleep(waitTime);
                }

                counter2++;
            }

            return charges.length > 0 ? Math.min(...charges) : 100;
        } else {
            console.log(`no droids to charge`);
        }

        return 100;
    }

    async dispenseDroids (doWaitAfterDispense) {
        console.log(`check for dispense`);
        let droidsToDispense = this.droidData.filter(m => m.attributes.storage > 0 && m.attributes.state === "idle");

        droidsToDispense = droidsToDispense.filter(d => d.attributes.storage > config.dispense.DispenseMin);

        if (droidsToDispense.length === 0) {
            console.log("no droids to dispense");
        } else {
            const landfieldIds = [... new Set(droidsToDispense.map(d => d.attributes.landfieldId))];

            console.log(`landfields with droids awaiting dispense: ${landfieldIds.length}`);
            await helper.sleep(3000);
            let counter = 1;

            for (let i = 0; i < landfieldIds.length; i++) {
                let landfieldId = landfieldIds[i];

                const matchingLandfield = this.droidLandfields.find(l => l.id === landfieldId);
                const matchingDroids = droidsToDispense.filter(d => d.attributes.landfieldId === landfieldId);

                let skipLandfield = await this.shouldSkipDueActiveCiv(matchingLandfield);
                if (skipLandfield) {
                    logger.log(true, `  skipping (${matchingLandfield.attributes.location}) due active civ`);
                    continue;
                }

                const loc = matchingLandfield.attributes.location;
                const desc = matchingLandfield.attributes.description;
                const amountToDispense = matchingDroids.reduce((a, b) => a + b.attributes.storage, 0);

                console.log(
                    `%c(${counter}/${landfieldIds.length}) dispensing [%c${amountToDispense.toFixed(2)}%c] e-ther from %c${matchingDroids.length} %cdroid(s)\r\n   ${loc} | ${desc}`,
                    "color:snow",
                    `color:${this.getDispenseAmountColor(amountToDispense)}`,
                    "color:snow", "color:gold", "color:snow");

                try {    
                    await ___reactContext.api.apiClient.put("/droids/dispense", { ids: matchingDroids.map(md => md.id), landfield: landfieldId });
                } catch (error) {
                    console.error(`Error dispensing deez nutz: ${error}`);
                }

                await helper.sleep(2000);
                counter++;
                if (helper.isModN(counter, 10)) {
                    await helper.sleep(2000);
                }
            }

            droidsToDispense.forEach(d => this.droidData.find(dd => dd.id === d.id).attributes.state = "dispensing");

            if (doWaitAfterDispense) {
                let waitTimeAfterDispense = landfieldIds.length * 1000 + 10000;
                console.log(`wait after dispense: ${(waitTimeAfterDispense / 1000).toFixed(2)}s`);
                await helper.sleep(waitTimeAfterDispense);
            }
        }
    }

    getDispenseAmountColor (dispenseAmount) {
        if ((dispenseAmount % 3) < 0.01) {
            return "gold";
        } else if (dispenseAmount > 3) {
            return "deepskyblue";
        } else if (dispenseAmount > 1) {
            return "lime";
        } else {
            return "red";
        }
    }

    async raidDroids () {
        console.log(`check for droids to raid`);

        this.droidLandfields.forEach(dl => {
            dl.droids = this.droidData.filter(dd => dl.meta.droidIds && dl.meta.droidIds.includes(dd.id))
            dl.availableDroids = dl.droids.filter(droid =>
                droid.attributes.state === "idle"
                //&& droid.currentCharge > 15
                && droid.attributes.storage !== droid.attributes.maxStorage
            )
        })
        let availableLandfields = this.droidLandfields.filter(dl => dl.availableDroids.length > 0);

        if (availableLandfields.length > 0) {
            this.markStart();
            if (availableLandfields.length > 0) {
                let raidHistory = (await this.raidHistoryCache.getAll()).filter(notification => notification.userId === auth0user.id);

                let doWaitExtra = availableLandfields.length > config.raiding.waitTimes.extra.propertyCountMin;
                let extraWaitTime = doWaitExtra ? config.raiding.waitTimes.extra.wait : 0;
                for (let i = 0; i < availableLandfields.length; i++) {
                    let landfield = availableLandfields[i];
                    logger.logPropertyProcessing(landfield, availableLandfields, i);

                    let shouldSkip = await this.shouldSkipDueActiveCiv(landfield);
                    if (shouldSkip) {
                        logger.log(true, ` %c active civ -> skip`, ["color:red"]);
                        continue;
                    }

                    let r = await this.calculateRaidSetupsForProperty(landfield, raidHistory);
                    try {
                        await this.launchRaid(r.raidSetups, r.favorites);
                    } catch (error) {
                        console.error(`Error launching deez nuts: ${error}`);
                    }

                    if (((i + 1) % config.raiding.waitTimes.extra.afterEvery) === 0 && extraWaitTime > 0) {
                        console.log(`---- extra wait: ${extraWaitTime}`);
                        await helper.sleep(extraWaitTime);
                    }
                }
            }

            this.markEnd(availableLandfields);
        } else {
            console.log("no raids to launch");
        }
    }

    async calculateRaidSetupsForProperty (landfield, raidHistory) {

        let result = [];

        let allFavorites = await api.getRaidTargetForProperty(landfield, true, false);

        if (allFavorites.length > 0) {
            this.setTargetState(allFavorites, raidHistory);
        }

        if (allFavorites.length === 0) {
            logger.logNoTargets(landfield);
        } else if (allFavorites.length === 1) {
            //in case only one favorite present -> use that
            let target = allFavorites[0];
            if (target.targetState === TargetState.Keep || target.targetState === TargetState.LastRaidForFull) {
                logger.logUsingOnlyFavorite(target);
                result.push(this.getRaidSetupForTarget(landfield, target, true));
            }
            else {
                logger.logNoTargets(landfield, target);
            }
        } else {

            let allGoodTargets = allFavorites.filter(t => t.targetState === TargetState.Keep && !t.meta.isRaided);
            if (config.raiding.useClosestInCurrentBracket) {
                //
                let bracket1 = allGoodTargets.filter(t => t.attributes.tileCount >= 750);
                let bracket2 = allGoodTargets.filter(t => t.attributes.tileCount < 750 && t.attributes.tileCount >= 600);
                let bracket3 = allGoodTargets.filter(t => t.attributes.tileCount < 600 && t.attributes.tileCount >= 500);
                let bracket4 = allGoodTargets.filter(t => t.attributes.tileCount < 500 && t.attributes.tileCount >= 400);
                let bracket5 = allGoodTargets.filter(t => t.attributes.tileCount < 400 && t.attributes.tileCount >= 300);
                let bracket6 = allGoodTargets.filter(t => t.attributes.tileCount < 300 && t.attributes.tileCount >= 200);
                let bracket7 = allGoodTargets.filter(t => t.attributes.tileCount < 200 && t.attributes.tileCount >= 100);
                let bracket8 = allGoodTargets.filter(t => t.attributes.tileCount < 100 && t.attributes.tileCount >= 1);

                let brackets = [bracket1, bracket2, bracket3, bracket4, bracket5, bracket6, bracket7, bracket8];
                for (let i = 0; i < brackets.length; i++) {
                    brackets[i] = brackets[i].sort((a, b) => a.meta.distanceKm > b.meta.distanceKm ? 1 : -1);
                    //console.log("bracket: ", brackets[i]);
                }
                allGoodTargets = brackets.flat();
                //console.log("all good targets: ", allGoodTargets);
                //throw new Error("test brackets");
            }

            //first try those where the last result was full
            let bestTargets1 = allGoodTargets.filter(t => t.raidResults.length > 0 && t.raidResults[0] > 0 && helper.isModN(t.raidResults[0], 3));
            let bestTargets2 = allGoodTargets.filter(t => t.raidResults.length === 0);
            let bestTargets3 = allGoodTargets.filter(f => !bestTargets1.find(agt => agt.id === f.id) && !bestTargets2.find(agt => agt.id === f.id));

            allGoodTargets = bestTargets1.concat(bestTargets2).concat(bestTargets3);

            //logger.logFavorites("all good targets: ", allGoodTargets);

            for (let i = 0; i < allGoodTargets.length; i++) {
                let target = allGoodTargets[i]
                result.push(this.getRaidSetupForTarget(landfield, target, false));

                if (landfield.availableDroids.length === 0)
                    break;
            }

            if (landfield.availableDroids.length > 0) {
                //we still have droids left -> check for rechecks/remaining
                let remainingTargets = allFavorites.filter(f => !allGoodTargets.find(agt => agt.id === f.id))
                this.recheckRemaining(landfield, result, remainingTargets);
            }

        }

        if (landfield.availableDroids.length > 0) {
            logger.logRemainingDroids(landfield, allFavorites);
        }

        return { raidSetups: result, favorites: allFavorites };
    }

    recheckRemaining (landfield, result, remainingTargets) {
        if (remainingTargets.length > 0) {
            //1) check for targets where last raid was below limit but enough time elapsed
            //2) if we still have droids -> check for targets where last raid failed but had wins
            //3) if we still have droids -> check for targets with any wins and no droids
            //4) if we still have droids -> check for targets with any wins and droids :|
            this.recheckBelowLimit(landfield, result, remainingTargets);

            if (landfield.availableDroids.length > 0) {
                this.recheckLastFailed(landfield, result, remainingTargets);
            }
            if (landfield.availableDroids.length > 0) {
                this.recheckAnyWinsNoDroids(landfield, result, remainingTargets);
            }

            if (config.raiding.allowRecheckForAnyWinsWithDroids) {
                if (landfield.availableDroids.length > 0) {
                    this.recheckAnyWinsWithDroids(landfield, result, remainingTargets);
                }
            }
        }
    }

    recheckAnyWinsWithDroids (landfield, result, remainingTargets) {
        let targets = remainingTargets.filter(t => t.hasAnyWins && t.hasDroids);
        targets.forEach(t => t.targetState = TargetState.RecheckAnyWinsWithDroids);
        this.setTargetsForOverRaided(landfield, result, targets)
    }

    recheckAnyWinsNoDroids (landfield, result, remainingTargets) {
        let targets = remainingTargets.filter(t => t.hasAnyWins && !t.hasDroids);
        targets.forEach(t => t.targetState = TargetState.RecheckAnyWinsWithoutDroids);
        this.setTargetsForOverRaided(landfield, result, targets)
    }

    recheckLastFailed (landfield, result, remainingTargets) {
        let targets = remainingTargets.filter(t =>
            t.targetState === TargetState.HadWinsButLastRaidFailed
            && t.lastRaidResult.createdDate.getTime() < new Date().getTime() - hourMultiplier * config.raiding.allowLastRaidFailedRecheckAfter);
        targets.forEach(t => t.targetState = TargetState.RecheckLastFailed);
        this.setTargetsForOverRaided(landfield, result, targets);
    }

    recheckBelowLimit (landfield, result, remainingTargets) {
        let targets = remainingTargets.filter(t =>
            t.targetState === TargetState.LastRaidBelowLimit
            && t.lastRaidResult.createdDate.getTime() < new Date().getTime() - hourMultiplier * config.raiding.allowLastRaidBelowRecheckAfter);
        targets.forEach(t => t.targetState = TargetState.RecheckLastBelow);
        this.setTargetsForOverRaided(landfield, result, targets);
    }

    setTargetsForOverRaided (landfield, result, targets) {
        if (targets.length > 0) {
            for (let i = 0; i < targets.length; i++) {
                let target = targets[i];
                logger.logOverRaidRecheck(target);
                result.push(this.getRaidSetupForTarget(landfield, target, false));

                if (landfield.availableDroids.length === 0)
                    break;
            }
        }

    }

    setTargetState (targets, raidHistory) {

        for (let i = 0; i < targets.length; i++) {
            let target = targets[i];
            target.targetState = TargetState.Keep;

            let alreadyRaided = target.meta.isRaided;
            target.hasDroids = target.meta.droidIds.length > 0;

            target.raidedLast24Hours = raidHistory.filter(rn =>
                rn.data.enemyLandfield
                && rn.data.enemyLandfield.id === target.id
                && rn.createdDate.getTime() > new Date().getTime() - hourMultiplier * 24).sort((a, b) => a.id < b.id ? 1 : -1);
            target.raidResults = target.raidedLast24Hours.map(n => n.event_type === config.notifications.raidNotificationTypes.raid_won ? n.data.etherAmount : 0);

            if (alreadyRaided) {
                target.targetState = TargetState.AlreadyBeingRaided;
                continue;
            }

            this.checkOverRaidedState(target);
        }
    }

    checkOverRaidedState (target) {
        //console.log("checking target : ", target);
        if (target.raidedLast24Hours.length > 0) {
            let lastRaidResult = target.raidedLast24Hours[0];
            target.lastRaidResult = lastRaidResult;

            target.lastRaidWon = lastRaidResult.event_type === config.notifications.raidNotificationTypes.raid_won;
            target.lastRaidBelowLimit = target.lastRaidWon && lastRaidResult.data.etherAmount < config.raiding.skipIfLastRaidBelow;
            target.lastRaidForToday = false;
            target.lastRaidForToday = target.lastRaidWon
                && target.raidedLast24Hours.length > 1
                && helper.isModN(target.raidedLast24Hours[1].data.etherAmount, 3)
                && !helper.isModN(lastRaidResult.data.etherAmount, 3); //so the result before the last is 3x (e.g. 3,6,9) but the last one isn't
            target.hasAnyWins = target.raidedLast24Hours.some(n => n.event_type === config.notifications.raidNotificationTypes.raid_won);
            target.hadWinsButLastRaidFailed = !target.lastRaidWon && target.hasAnyWins;
            target.noWinsAtAll = !target.hasAnyWins && target.raidedLast24Hours.length > 1;

            switch (true) {
                case target.noWinsAtAll:
                    target.targetState = TargetState.NoWinsAtAll;
                    break;
                case target.hadWinsButLastRaidFailed:
                    target.targetState = TargetState.HadWinsButLastRaidFailed;
                    break;
                case target.lastRaidForToday:
                    target.targetState = TargetState.LastRaidForFull;
                    break;
                case target.lastRaidBelowLimit:
                    target.targetState = TargetState.LastRaidBelowLimit;
                    break;
                default:
                    break;
            }
        }
    }

    getRaidSetupForTarget (landfield, target, useAllDroids) {
        let spliceLength = useAllDroids ? landfield.availableDroids.length : target.matchingLimit.maxDroids
        return new RaidSetup(landfield, target, landfield.availableDroids.splice(0, spliceLength));
    }

    markStart () {
        performance.mark("start");
        console.log(helper.getFormattedTime() + " : ");
    }

    markEnd (properties) {
        console.log(helper.getFormattedTime() + " : ");
        performance.mark("end");
        let measure = performance.measure("start-end", "start", "end");
        let duration = measure.duration;
        let seconds = duration / 1000;
        let minutes = Math.floor(seconds / 60);
        console.log(`calculation for ${properties.length} properties took ${minutes}m ${(seconds - minutes * 60).toFixed(2)}s`)
    }

    markCycleStart () {
        performance.mark("cycle-start");
        console.log(`${helper.getFormattedTime()} cycle start`);
    }

    markCycleEnd () {
        performance.mark("cycle-end");
        let measure = performance.measure("cycle-start-end", "cycle-start", "cycle-end");
        let duration = measure.duration;
        let seconds = duration / 1000;
        let minutes = Math.floor(seconds / 60);
        console.log(`%c** cycle took ${minutes}m ${(seconds - minutes * 60).toFixed(2)}s **`, "color:gold")
        console.log(`${helper.getFormattedTime()} cycle ended`);
    }

    async launchRaid (raidSetups, favorites) {
        for (let i = 0; i < raidSetups.length; i++) {
            let raidSetup = raidSetups[i];
            let waitTimes = this.getWaitTimes(raidSetups);

            logger.logRaidLaunch(raidSetup, waitTimes, i === raidSetups.length - 1 ? favorites : null);
            if (config.raiding.doRaid) {
                await helper.sleep(waitTimes.waitBefore);
                await api.raid(raidSetup.landfieldId, raidSetup.usedDroids.map(d => d.id));
                await helper.sleep(waitTimes.waitAfter);
            } else {
                await helper.sleep(waitTimes.waitBefore);
            }
        }
    }

    getWaitTimes (raidSetups) {
        let isSmall = raidSetups.length === 1 && raidSetups[0].usedDroids.length === 1;
        let min = isSmall ? config.raiding.waitTimes.small.min : config.raiding.waitTimes.normal.min;
        let max = isSmall ? config.raiding.waitTimes.small.max : config.raiding.waitTimes.normal.max;
        let waitBefore = helper.getRandom(min * 0.25, max * 0.25);
        let waitAfter = helper.getRandom(min * 0.75, max * 0.75);
        return { waitBefore, waitAfter };
    }
}

let raidHelper = new RaidHelper();

class UIHandler {
    constructor() {
        this.buttonId = "raid-deez";
        this.activeClassName = "active";
        this.buttonHTML = `<button id="${this.buttonId}" class="do-it-kermit" style="${config.ui.buttonStyle}"><img src="https://imgur.com/V3Xlcjw.png"></button>`;

        this.style = `
            .do-it-kermit{
                border: 6px solid #222328;
                border-radius: 10px;
                z-index:10000;
                width:90px;
            }

            .do-it-kermit:hover{
                border-width:8px;
            }

            .do-it-kermit.${this.activeClassName}{
                border-color:#54d9bb;
            }
        `;
    }

    init () {
        this.addStyle(this.style, "happy-bunny");

        document.querySelector("body").insertAdjacentHTML("afterbegin", this.buttonHTML);
        let btn = document.getElementById(this.buttonId);
        if (btn) {
            btn.addEventListener("click", async () => { await this.clickHandler(btn); });

        }

        let closeFeed = document.querySelector("button.bg-base-700");
        if (closeFeed) {
            closeFeed.click();
        }

        if (config.ui.autoClick > 0) {
            this.intervalHandle = setInterval(() => {
                if (!this.isBusy(btn)) {
                    console.log(`%c${helper.getFormattedTime()} %c AUTOCLICK -> START`, "color:lime", "color:gold");
                    btn.click();
                } else {
                    console.log(`%c${helper.getFormattedTime()} %c AUTOCLICK -> BUSY`, "color:lime", "color:red");
                }
            }, config.ui.autoClick * 1000 * 60);
        }

        this.extendTargetList();
    }

    async clickHandler (btn) {
        try {
            if (!btn.classList.contains(this.activeClassName)) {
                btn.classList.add(this.activeClassName);

                await raidHelper.doCycle();

                btn.classList.remove(this.activeClassName);
            } else {
                console.log(`%cALREADY DOING STUFF PLS WAIT`, "color:red");
            }
        } catch (e) {
            console.error("error caught: ", e);
            btn.classList.remove(this.activeClassName);
        }
    }

    isBusy = (btn) => btn.classList.contains(this.activeClassName);


    addStyle (styleText, className) {
        try {
            if (Array.from(document.querySelectorAll(`style.${className}`)).length === 0) {
                let sheet = document.createElement('style');
                sheet.classList.add(className);
                sheet.innerHTML = styleText;
                document.body.appendChild(sheet);
            }
        } catch (e) {
            console.log("error in [addStyle]", e);
        }
    }

    extendTargetList () {
        //___reactContext.theGridStore.raidMenuStore[Reflect.ownKeys(___reactContext.theGridStore.raidMenuStore).reverse()[1]]
        let raidMenuStore = ___reactContext.theGridStore.raidMenuStore;
        let template = `<td class="text-sm" style="color:snow;">#value#</td>`;

        setInterval(() => {

            let menu = document.querySelector(".absolute.bg-base-700");
            if(menu){
                menu.style.position = "absolute";
                menu.style.left = "0";
                menu.style.width = "95vw";
            }

            const raidSourceId = raidMenuStore.expandedRaidMenuLandfieldId;
            let table = document.querySelector(".customScrollBar table");
            if (raidSourceId && table && Array.from(document.querySelector(".customScrollBar table tbody tr").querySelectorAll("td")).length === 4) {
    
                let headRow = document.querySelector(".customScrollBar table thead tr");
                if(document.querySelectorAll(".customScrollBar table thead tr th").length === 4){
                    ["CDs","Civs","Tier/class"].forEach(txt => headRow.insertAdjacentHTML("beforeend", template.replaceAll("td","th").replace("#value#", txt)));
                }
    
                let index = raidMenuStore.raidMenuLandfields.findIndex(x => x.landfieldId == raidSourceId);
                let entries = Array.from(raidMenuStore.raidMenuLandfields[index].propertiesStore.data.data_.entries()).map(m => m[1].value_);
                //console.log(entries);
    
                Array.from(document.querySelectorAll(".customScrollBar table tbody tr")).forEach((tr, index) => {
                    let entry = entries[index];
                    [entry.droidIds.length,entry.civilianIds.length,`${entry.landfield.landfieldTier} | ${entry.landfield.tileClass ?? "-"}` ]
                        .forEach(txt => tr.insertAdjacentHTML(
                            "beforeend", 
                            template.replace("#value#", txt).replace("snow",this.getRowColor(entry))
                            )); 
                });
                //console.log("table extended")
            }
        }, 200);
        
    }

    getRowColor(entry){
        switch(true){
            case (entry.droidIds.length === 0 && entry.civilianIds.length === 0): return "lime";
            case entry.favorite !== null: return "red";
            default: return "snow";
        }
         
    }
}

let ui = new UIHandler();
ui.init();