#!/bin/bash

for num in `seq 1 25`;
do
    touch 2018-05-06-challenge-$num.markdown
    echo "---" >> 2018-05-06-challenge-$num.markdown
    echo "layout: post" >> 2018-05-06-challenge-$num.markdown
    echo "title:  \"Challenge $num\"" >> 2018-05-06-challenge-$num.markdown
    if [ $num -le 10 ] ; then
        echo "date:   2018-05-06 05:0$num:11 +0000" >> 2018-05-06-challenge-$num.markdown
    else
        echo "date:   2018-05-06 05:$num:11 +0000" >> 2018-05-06-challenge-$num.markdown
    fi
    echo "categories: challenges" >> 2018-05-06-challenge-$num.markdown
    echo "---" >> 2018-05-06-challenge-$num.markdown


done
