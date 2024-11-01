import { ServiceTester } from '../tester.js'
import {
  isMetric,
  isVPlusDottedVersionNClauses,
  isVPlusDottedVersionNClausesWithOptionalSuffix,
} from '../test-validators.js'
import {
  queryIndex,
  nuGetV3VersionJsonFirstCharZero,
  nuGetV3VersionJsonFirstCharNotZero,
  nuGetV3VersionJsonBuildMetadataWithDash,
} from '../nuget-fixtures.js'
import { invalidJSON } from '../response-fixtures.js'

export const t = new ServiceTester({ id: 'nuget', title: 'NuGet' })

// downloads

t.create('total downloads (valid)')
  .get('/dt/Microsoft.AspNetCore.Mvc.json')
  .expectBadge({
    label: 'downloads',
    message: isMetric,
  })

t.create('total downloads (not found)')
  .get('/dt/not-a-real-package.json')
  .expectBadge({ label: 'downloads', message: 'package not found' })

t.create('total downloads (unexpected second response)')
  .get('/dt/Microsoft.AspNetCore.Mvc.json')
  .intercept(nock =>
    nock('https://api.nuget.org').get('/v3/index.json').reply(200, queryIndex),
  )
  .intercept(nock =>
    nock('https://api-v2v3search-0.nuget.org')
      .get(
        '/query?q=packageid%3Amicrosoft.aspnetcore.mvc&prerelease=true&semVerLevel=2',
      )
      .reply(invalidJSON),
  )
  .expectBadge({ label: 'downloads', message: 'unparseable json response' })

// version

t.create('version (valid)')
  .get('/v/Microsoft.AspNetCore.Mvc.json')
  .expectBadge({
    label: 'nuget',
    message: isVPlusDottedVersionNClauses,
  })

t.create('version (orange badge)')
  .get('/v/Microsoft.AspNetCore.Mvc.json')
  .intercept(nock =>
    nock('https://api.nuget.org').get('/v3/index.json').reply(200, queryIndex),
  )
  .intercept(nock =>
    nock('https://api-v2v3search-0.nuget.org')
      .get(
        '/query?q=packageid%3Amicrosoft.aspnetcore.mvc&prerelease=true&semVerLevel=2',
      )
      .reply(200, nuGetV3VersionJsonFirstCharZero),
  )
  .expectBadge({
    label: 'nuget',
    message: 'v0.35',
    color: 'orange',
  })

t.create('version (blue badge)')
  .get('/v/Microsoft.AspNetCore.Mvc.json')
  .intercept(nock =>
    nock('https://api.nuget.org').get('/v3/index.json').reply(200, queryIndex),
  )
  .intercept(nock =>
    nock('https://api-v2v3search-0.nuget.org')
      .get(
        '/query?q=packageid%3Amicrosoft.aspnetcore.mvc&prerelease=true&semVerLevel=2',
      )
      .reply(200, nuGetV3VersionJsonFirstCharNotZero),
  )
  .expectBadge({
    label: 'nuget',
    message: 'v1.2.7',
    color: 'blue',
  })

// https://github.com/badges/shields/issues/4219
t.create('version (build metadata with -)')
  .get('/v/MongoFramework.json')
  .intercept(nock =>
    nock('https://api.nuget.org').get('/v3/index.json').reply(200, queryIndex),
  )
  .intercept(nock =>
    nock('https://api-v2v3search-0.nuget.org')
      .get('/query?q=packageid%3Amongoframework&prerelease=true&semVerLevel=2')
      .reply(200, nuGetV3VersionJsonBuildMetadataWithDash),
  )
  .expectBadge({
    label: 'nuget',
    message: 'v1.17.0',
    color: 'blue',
  })

t.create('version (not found)')
  .get('/v/not-a-real-package.json')
  .expectBadge({ label: 'nuget', message: 'package not found' })

t.create('version (unexpected second response)')
  .get('/v/Microsoft.AspNetCore.Mvc.json')
  .intercept(nock =>
    nock('https://api.nuget.org').get('/v3/index.json').reply(200, queryIndex),
  )
  .intercept(nock =>
    nock('https://api-v2v3search-0.nuget.org')
      .get(
        '/query?q=packageid%3Amicrosoft.aspnetcore.mvc&prerelease=true&semVerLevel=2',
      )
      .reply(invalidJSON),
  )
  .expectBadge({ label: 'nuget', message: 'unparseable json response' })

// version (pre)

t.create('version (pre) (valid)')
  .get('/vpre/Microsoft.AspNetCore.Mvc.json')
  .expectBadge({
    label: 'nuget',
    message: isVPlusDottedVersionNClausesWithOptionalSuffix,
  })

t.create('version (pre) (orange badge)')
  .get('/vpre/Microsoft.AspNetCore.Mvc.json')
  .intercept(nock =>
    nock('https://api.nuget.org').get('/v3/index.json').reply(200, queryIndex),
  )
  .intercept(nock =>
    nock('https://api-v2v3search-0.nuget.org')
      .get(
        '/query?q=packageid%3Amicrosoft.aspnetcore.mvc&prerelease=true&semVerLevel=2',
      )
      .reply(200, nuGetV3VersionJsonFirstCharZero),
  )
  .expectBadge({
    label: 'nuget',
    message: 'v0.35',
    color: 'orange',
  })

t.create('version (pre) (blue badge)')
  .get('/vpre/Microsoft.AspNetCore.Mvc.json')
  .intercept(nock =>
    nock('https://api.nuget.org').get('/v3/index.json').reply(200, queryIndex),
  )
  .intercept(nock =>
    nock('https://api-v2v3search-0.nuget.org')
      .get(
        '/query?q=packageid%3Amicrosoft.aspnetcore.mvc&prerelease=true&semVerLevel=2',
      )
      .reply(200, nuGetV3VersionJsonFirstCharNotZero),
  )
  .expectBadge({
    label: 'nuget',
    message: 'v1.2.7',
    color: 'blue',
  })

t.create('version (pre) (not found)')
  .get('/vpre/not-a-real-package.json')
  .expectBadge({ label: 'nuget', message: 'package not found' })

t.create('version (pre) (unexpected second response)')
  .get('/vpre/Microsoft.AspNetCore.Mvc.json')
  .intercept(nock =>
    nock('https://api.nuget.org').get('/v3/index.json').reply(200, queryIndex),
  )
  .intercept(nock =>
    nock('https://api-v2v3search-0.nuget.org')
      .get(
        '/query?q=packageid%3Amicrosoft.aspnetcore.mvc&prerelease=true&semVerLevel=2',
      )
      .reply(invalidJSON),
  )
  .expectBadge({ label: 'nuget', message: 'unparseable json response' })
