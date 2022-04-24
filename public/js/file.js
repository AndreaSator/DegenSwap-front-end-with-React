/*$('#BEP').niceSelect();
$('#bswap').niceSelect();

$('#ERC').niceSelect();
$('#ETH').niceSelect();*/
$('#connectwalletselect').niceSelect();
function swapDropdown() {
    let pageY;
    let closeCaret = document.querySelector(' .swap__ledger__nav i')
    if (typeof closeCaret != 'undefined' && closeCaret != null) {
        let linkLegder = closeCaret.previousElementSibling;
        let parentCaret = closeCaret.parentElement
        let contSec = closeCaret.parentElement.nextElementSibling
        let showViews = document.querySelector('.showviews')
        let container2 = document.querySelector(".swap__ledger__container2")
        let container1 = document.querySelector(".swap__ledger__container")
        let listIcon = document.querySelector('.listView')
        let gridIcon = document.querySelector('.gridView')
        closeCaret.addEventListener('click', slide)

        function slide() {
            if (!(contSec.classList.contains('slide'))) {
                parentCaret.style.marginBottom = '2.5rem'
                contSec.classList.remove('true')
                contSec.classList.add('slide')
                closeCaret.classList.add('rotate')

                document.documentElement.style.scrollBehavior = 'smooth'
                showViews.classList.add('show')
                gridIcon.style.color = "#fd0352"
                listIcon.style.color = "#aaa"

            } else {
                parentCaret.style.marginBottom = '0'
                contSec.classList.remove('slide')
                closeCaret.classList.remove('rotate')
                container2.classList.remove('show')
                container1.classList.remove('hide')
                document.documentElement.style.scrollBehavior = 'auto'
                showViews.classList.remove('show')
                listIcon.style.color = "#aaa"
            }
        }
        return true
    }
}

swapDropdown()


function addCtive() {


    let listItems = document.querySelectorAll('.list-nav1 > li')


    listItems.forEach((item) => {

        item.onmouseenter = () => {

            for (var i = 0; i < listItems.length; i++) {

                listItems[i].classList.remove('active')
            }

            item.classList.add('active')
        }



    })
}

addCtive()


function toggleBtn() {


    var onSpan = document.querySelectorAll('.onspan')
    var offSpan = document.querySelectorAll('.offspan')

    var inputOn = document.querySelectorAll('.checkon')

    var inputOff = document.querySelectorAll('.checkoff')



    onSpan.forEach((item, index) => {

        item.onclick = function () {
            inputOn[index].checked = true;
            inputOff[index].checked = false;
            item.style.backgroundColor = "#29f80c"
            offSpan[index].style.background = "none"
        }

    })

    offSpan.forEach((item, index) => {

        item.onclick = function () {
            inputOn[index].checked = false;
            inputOff[index].checked = true
            item.style.backgroundColor = "#ababab"
            onSpan[index].style.background = "none"

        }
    })



}


toggleBtn()



function showOptions() {


    var settingIcon = document.querySelector('.setting')
    var opts = document.querySelector('.options')



    settingIcon.onclick = function () {

        if (!(opts.classList.contains('show'))) {

            opts.classList.add('show')
        } else {

            opts.classList.remove('show')
        }
    }

    settingIcon.onmouseenter = function () {

        opts.classList.add('show')
    }




    //closing popup 

    document.querySelector('.hero__content').onclick = function () {

        opts.classList.remove('show')

    }
    document.querySelector('.header').onclick = function (e) {

        if (!(e.target.classList.contains('setting'))) {

            opts.classList.remove('show')
        }

        console.log(e.target)

    }

    opts.onclick = function (e) {


        e.stopPropagation()
    }



}

showOptions()


function showGirdList() {

    var gridIcon = document.querySelector('.listView')
    var listIcon = document.querySelector('.gridView')

    var listDiv = document.querySelector('.swap__ledger__container')

    var gridDiv = document.querySelector('.swap__ledger__container2')


    gridIcon.onclick = function () {

        listDiv.classList.add('hide')


        gridDiv.classList.add('show')

        this.style.color = "#fd0352"
        listIcon.style.color = "#aaa"
    }



    listIcon.onclick = function () {

        listDiv.classList.remove('hide')


        gridDiv.classList.remove('show')

        this.style.color = "#fd0352"

        gridIcon.style.color = "#aaa"
    }

}



showGirdList()


function dropdownTable() {


    var icondropDown = document.querySelector('.icondropdown')


    var list = document.querySelector('.dropdown')



    icondropDown.onclick = function () {

        if (!(list.classList.contains('show'))) {

            list.classList.add('show')

            icondropDown.classList.add('rotate')
        } else {

            list.classList.remove('show')
            icondropDown.classList.remove('rotate')
        }

    }
}
dropdownTable()





//addtokens 



function getTokens() {


    var tokens = document.querySelectorAll('.tokens')

    var popup = document.querySelector('.popup')

    var closeBtn = document.querySelector('.close')

    var listItems = document.querySelectorAll('.popup .wrap .tokenlist ul li')

    closeBtn.onclick = function () {
        popup.classList.remove('show')
        document.documentElement.style.overflow = "visible"
    }
    popup.onclick = function (e) {
        if (e.target.classList.contains('popup')) {
            popup.classList.remove('show')
            document.documentElement.style.overflow = "visible"
        }

    }


    tokens.forEach((item) => {
        item.onclick = function () {
            popup.classList.add('show')
            document.documentElement.style.overflow = "hidden";
            listItems.forEach((listelement) => {
                listelement.onclick = function (e) {
                    for (var i = 0; i < listItems.length; i++) {


                        listItems[i].classList.remove('active')
                    }


                    this.classList.add('active')


                    item.innerHTML =
                        `<img class = "jsimg" src ="${listelement.firstElementChild.getAttribute('src')}"/> <span class = "jsspan" >${listelement.firstElementChild.nextElementSibling.textContent}</span> <span class="icon-chevron-down"></span>`

                    popup.classList.remove('show')
                    document.documentElement.style.overflow = "visible";
                }
            })






        }

    })


}
getTokens()





function searchInput() {



    var myInput = document.querySelector('.popup .wrap .inputgroup input')

    var liItms = document.querySelectorAll('.popup .wrap .tokenlist ul li')

    var reqTxt = document.querySelectorAll('.popup .wrap .tokenlist ul li span:nth-child(2)')


    function myFunction() {
        var input, filter, ul, li, span, i, txtValue;
        input = document.querySelector(".popup .wrap .inputgroup input");
        filter = input.value.toUpperCase();
        ul = document.querySelector(".popup .wrap .tokenlist ul");
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            span = li[i].getElementsByTagName("span")[0];
            txtValue = span.textContent || span.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }


    myInput.addEventListener('keyup', myFunction)
}

searchInput()







function dropdownView2() {


    var btndrop = document.querySelector('.btn-drop')


    var dropList = document.querySelector('.dropdownrow')



    btndrop.onclick = function () {


        if (dropList.classList.contains('show')) {


            dropList.classList.remove('show')
            document.querySelectorAll('.row3').forEach((item) => {

                item.style.height = "65px";
                item.style.alignItems = "center";
                if (window.matchMedia("(max-width: 500px)").matches) {
                    item.style.height = "80px";
                }
                if (window.matchMedia("(max-width: 400px)").matches) {
                    item.style.height = "90px";
                }
            })

            btndrop.classList.remove('rotate')

        } else {

            dropList.classList.add('show')
            document.querySelectorAll('.row3').forEach((item) => {

                item.style.height = "250px";
                item.style.alignItems = "flex-start";
                if (window.matchMedia("(max-width: 600px)").matches) {
                    item.style.height = "450px";
                }
            })
            btndrop.classList.add('rotate')
        }
    }
}
dropdownView2()



function showpopup() {


    var icon = document.querySelector('.hero__content--form form > div:nth-child(3) .bottomtext i')

    var txt = document.querySelector('.dummypopup')


    icon.onclick = function () {


        if (txt.classList.contains('show')) {

            txt.classList.remove('show')
        } else {

            txt.classList.add('show')
        }
    }
}

showpopup()


function showLogos() {


    var imgs = document.querySelectorAll('.hero__content--logos a img')
    var txts = document.querySelectorAll('.hero__content--logos a p')
    imgs.forEach((item, index) => {

        item.onclick = function () {

            if (window.matchMedia("(max-width: 600px)").matches) {

                for (var i = 0; i < imgs.length; i++) {
                    txts[i].classList.remove('show')
                }
                if (txts[index].classList.contains('show')) {

                    txts[index].classList.remove('show')
                } else {

                    txts[index].classList.add('show')
                }
            }

        }

    })
}



showLogos()


document.querySelectorAll('.hero__content--logos a').forEach((item) => {

    item.onclick = function (e) {

        e.preventDefault()
    }
})




function addActive() {


    let logoBrand = document.querySelectorAll('.five-logos > div')



    logoBrand.forEach((item) => {

        item.onclick = function () {

            for (var i = 0; i < logoBrand.length; i++) {

                logoBrand[i].classList.remove('active')
            }

            item.classList.add('active')
        }
    })
}

addActive()




function addActiveValue() {


    let spanValue = document.querySelectorAll('.slippage-tolerance .selectvalue > span')

    let getValue = document.querySelector('.slippage-tolerance .getvalue')

    let myInput = document.querySelector('.slippage-tolerance .values .custom-values input')

    spanValue.forEach((item) => {

        item.onclick = function () {

            for (var i = 0; i < spanValue.length; i++) {

                spanValue[i].classList.remove('active')
            }

            item.classList.add('active')

            getValue.textContent = item.textContent
        }


    })

    myInput.oninput = function () {

        if (myInput.value !== "") {
            getValue.textContent = myInput.value + "%"
        } else {

            getValue.textContent = document.querySelector('.content-slippage .selectvalue > span.active').textContent
        }
    }
}

addActiveValue()



function slideValue() {


    let chevron = document.querySelectorAll('.slidechevron')

    let valueList = document.querySelectorAll('.values')


    let show = false;




    chevron.forEach((item, index) => {

        item.onclick = function () {


            if (!(valueList[index].classList.contains('slide'))) {

                valueList[index].classList.add('slide')
                item.classList.add('rotate')
                show = true
            } else {

                valueList[index].classList.remove('slide')
                item.classList.remove('rotate')
                show = false
            }
        }
    })
}

slideValue()












function addActiveValueGas() {


    let spanValue = document.querySelectorAll('.Gas-price .selectvalue > span')

    let getValue = document.querySelector('.Gas-price .getvalue')

    let myInput = document.querySelector('.Gas-price .values .custom-values input')

    spanValue.forEach((item) => {

        item.onclick = function () {

            for (var i = 0; i < spanValue.length; i++) {

                spanValue[i].classList.remove('active')
            }

            item.classList.add('active')

            getValue.textContent = item.textContent.split(" ").reverse().join(" ") + " GEWI"


        }


    })

    myInput.oninput = function () {

        if (myInput.value !== "") {
            getValue.textContent = myInput.value
        } else {

            getValue.textContent = document.querySelector('.Gas-price .selectvalue > span.active').textContent
        }
    }
}


addActiveValueGas()




function slideLibrary() {


    let slidelibrary = document.querySelector('.slidelibrary')


    let dropdownLibrary = document.querySelector('.dropdownlibrary')


    let show = false


    function slide() {

        if (!show) {

            dropdownLibrary.classList.add('slide')
            slidelibrary.firstElementChild.classList.add('rotate')

            show = true
        } else {

            dropdownLibrary.classList.remove('slide')
            slidelibrary.firstElementChild.classList.remove('rotate')

            show = false
        }
    }

    slidelibrary.addEventListener('click', slide)
}



slideLibrary()




function slideCommunity() {


    let communityslide = document.querySelector('.communityslide')


    let dropdowncommuity = document.querySelector('.dropdowncommuity')


    let show = false


    function slide() {

        if (!show) {

            dropdowncommuity.classList.add('slide')
            communityslide.firstElementChild.classList.add('rotate')

            show = true
        } else {

            dropdowncommuity.classList.remove('slide')
            communityslide.firstElementChild.classList.remove('rotate')

            show = false
        }
    }

    communityslide.addEventListener('click', slide)
}



slideCommunity()



function slideAbout() {


    let Aboutslide = document.querySelector('.slideAbout')


    let dropdownAbout = document.querySelector('.dropdownAbout')


    let show = false


    function slide() {

        if (!show) {

            dropdownAbout.classList.add('slide')
            Aboutslide.firstElementChild.classList.add('rotate')

            show = true
        } else {

            dropdownAbout.classList.remove('slide')
            Aboutslide.firstElementChild.classList.remove('rotate')

            show = false
        }
    }

    Aboutslide.addEventListener('click', slide)
}



slideAbout()


function getRightMenu() {


    let btntomenu = document.querySelectorAll('.btntomenu')

    let mainBtn = document.querySelector('.mainBtn')
    let menuRight = document.querySelector('.right-sidemenu')

    btntomenu.forEach((item) => {
        item.onclick = function () {

            event.stopPropagation();
            menuRight.classList.add('slide')

            document.documentElement.style.overflow = "hidden"
        }

    })


    mainBtn.onclick = function () {
        document.documentElement.style.overflow = "visible"

        menuRight.classList.remove('slide')
    }
}



getRightMenu()







document.body.onclick = function (event) {



    console.log(event.target)
    if (!(event.target.classList.contains('right-sidemenu'))) {

        document.querySelector('.right-sidemenu').classList.remove('slide')
        document.documentElement.style.overflow = "visible"
    }
}



document.querySelector('.right-sidemenu').onclick = function (e) {

    e.stopPropagation()
}




function comingsoon() {

    let btn = document.querySelector('.hero__content--form .connect-wallet button')



    btn.onmouseenter = function () {

        btn.textContent = "Coming Soon"
        btn.parentElement.style.backgroundColor = "#fd0352"
        btn.style.color = "#fff"
    }

    btn.onmouseleave = function () {

        btn.textContent = "Connect Wallet"
        btn.parentElement.style.backgroundColor = "#000"

    }
}

comingsoon()






$('.owl-carousel').owlCarousel({
    loop: false,
    margin: 10,
    nav: true,
    dots: false,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 1
        },
        1000: {
            items: 1
        }
    }
})





document.querySelector('.owl-carousel .owl-nav button.owl-next span').innerHTML = `<i class="fas fa-chevron-right"></i>`




document.querySelector('.owl-carousel .owl-nav button.owl-prev').innerHTML = `<i class="fas fa-chevron-left"></i>`





function connectWallet() {


    let connectwallet = document.querySelector('.connectwallet')


    let login = document.querySelector('.login')


    let dotspan = document.querySelector('.dotspan')


    let connectpopup = document.querySelector('.connectpopup')

    let presalesmartswap = document.querySelector('.presalesmartswap')

    connectwallet.onclick = function () {



        connectpopup.classList.add('show')

        setTimeout(function () {
            connectpopup.classList.remove('show')
            connectwallet.classList.add('hide')

            login.classList.add('show')

            presalesmartswap.style.display = "none"
            dotspan.classList.add('active')
        }, 1200)
    }



}
connectWallet()


function logout() {


    let dotspan = document.querySelector('.dotspan')


    let connectwallet = document.querySelector('.connectwallet')


    let login = document.querySelector('.login')
    let menuRight = document.querySelector('.right-sidemenu')

    let presalesmartswap = document.querySelector('.presalesmartswap')

    dotspan.onclick = function (e) {

        e.stopPropagation()
        menuRight.classList.add('slide')

        document.documentElement.style.overflow = "hidden"

        login.classList.remove('show')
        connectwallet.classList.remove('hide')
        dotspan.classList.remove('active')

        presalesmartswap.style.display = "block"

    }
}



logout()



