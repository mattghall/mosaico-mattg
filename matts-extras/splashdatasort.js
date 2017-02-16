// Sorts save JSON by time, project, author, or dept
function SortList(daters,sort,author,dept)
{
  if (typeof author === 'undefined') { author = null; }
  if (typeof dept === 'undefined') { dept = null; }
  var data = JSON.parse(daters);
  data = AssureNoNullParty(data);

  if(author !== null)
  {
    data = FilterAuthor(data,author);
  }
  if(dept !== null)
  {
    data = FilterDept(data,dept);
  }

  switch(sort) {
      case "time":
          data = SortListTime(data);
          break;
      case "project":
          data = SortListProject(data);
          break;
      case "author":
          data = SortListAuthor(data);
          break;
      case "dept":
          data = SortListDept(data);
          break;
      default:
          data = SortListTime(data);
          break;
  }
  return data;
}

function FilterAuthor(list,author)
{
  var newData = [];
  var i;
  for(i=0; i< list.length; i++)
  {
    data = list[i];
    if(data.author === author)
      newData.push(data);
  }
  return newData;
}
function FilterDept(list,dept)
{
  var newData = [];
  var i;
  for(i=0; i< list.length; i++)
  {
    data = list[i];
    if(data.dept === dept)
      newData.push(data);
  }
  return newData;
}
function SortListTime(list)
{
  list.sort(function (a, b) {
    if (b.lastEdit > a.lastEdit) {
      return 1;
    }
    return -1;
  });
 return list;
}
function SortListProject(list)
{
  list.sort(function(a, b) {
    var aproject = a.name.toUpperCase(); // ignore upper and lowercase
    var bproject = b.name.toUpperCase(); // ignore upper and lowercase
    if (aproject < bproject) {
      return -1;
    }
    if (aproject > bproject) {
      return 1;
    }
    if(aproject == bproject)
    {
      if (b.lastEdit > a.lastEdit) {
        return 1;
      }
      return -1;
    }
  });
 return list;
}
function SortListAuthor(list)
{
  list.sort(function(a, b) {
    var aauthor = a.author.toUpperCase(); // ignore upper and lowercase
    var bauthor = b.author.toUpperCase(); // ignore upper and lowercase
    if (aauthor < bauthor) {
      return -1;
    }
    if (aauthor > bauthor) {
      return 1;
    }
    if(aauthor == bauthor)
    {
      if (b.lastEdit > a.lastEdit) {
        return 1;
      }
      return -1;
    }
  });
 return list;
}
function SortListDept(list)
{
  list.sort(function(a, b) {
    var adept = a.dept.toUpperCase(); // ignore upper and lowercase
    var bdept = b.dept.toUpperCase(); // ignore upper and lowercase
    if (adept < bdept) {
      return -1;
    }
    if (adept > bdept) {
      return 1;
    }
    if(adept == bdept)
    {
      if (b.lastEdit > a.lastEdit) {
        return 1;
      }
      return -1;
    }
  });
 return list;
}
function AssureNoNullParty(daters)
{
  var i;
  for(i=0; i< daters.length; i++)
  {
    data = daters[i];
    if(typeof data.name === 'undefined')
      data.name = "unknown";
    if(typeof data.author === 'undefined')
      data.author = "unknown";
    if(typeof data.dept === 'undefined')
      data.dept = "";
    if(typeof data.lastEdit === 'undefined')
      data.lastEdit = "0";
    if(typeof data.lastChanger === 'undefined')
      data.lastChanger = data.author;
    daters[i] = data;
  }
  return daters;
}
